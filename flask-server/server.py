import requests
import flask
import schedule
import re
import math
import calendar
import schedule



app = Flask(__name__)


#members API route
@app.route("/members")
def members():
    eventDescription = requests.args.get('name', default = "*", type = str)
    currentDate = requests.args.get('date', default = "*", type = str)
    eventPrototype = {"title": "", "startTime": "","startTimeMeridien":"", "endTime": "","endTimeMeridien":"", "dateMonth": "", "dateDay": "", "additionalPrompts": []}
    
    # Whenever key information is missing or unclear a prompt will be added to additional prompts
    additionalPrompts = [] 
    #Step 1: split event description into different parts
    eventWordList = eventDescription.split(" ")
    
    entityList = [[],[],[]]

    command_words = [
    "add",
    "insert",
    "schedule",
    "mark",
    "set",
    "place",
    "book",
    "organize",
    "create",
    "plan",
    "reserve",
    "arrange",
    "slot",
    "allocate",
    
]
    transition_words = [
    "at",
    "for",
    "on",
    "by",
    "during",
    "starting",
    "from",
    "beginning",
    "commencing",
    "scheduled at",
    "set for"
]

    date_indicators = [
    "on",
    "for the date",
    "scheduled for",
    "set for",
    "planned on",
    "to be on",
    "occurring on",
    "taking place on",
    "happening on",
    "dated"
]

    descriptor_words = [
    "a",
    "an",
    "the",
    "this",
    "that",
    "my",
    "our",
    "your",
    "his",
    "her",
    "its",
    "their",
    "some",
    "any",
    "each",
    "every",
    "both",
    "either",
    "neither",
    "few"
]


    
    switch = 0

    for word in eventWordList:
        if switch == 0:
            #Check for command words ?
            if word.lower() in command_words:
                
                continue
            print(word)
            switch=1
        if switch == 1:
            #Check for meeting as well as next words?
            if word.lower() not in transition_words:
                if word.lower() not in descriptor_words:
                    entityList[0].append(word)
                continue
            switch=2
            continue
        if switch == 2:
            #Check for time look for next words
            if not (word.lower() in transition_words or word.lower() in date_indicators):
                entityList[1].append(word)
                continue
            switch=3
            continue
        if switch == 3:
            entityList[2].append(word)
            #Check for date words
        
    #Step 2: parse these parts into strings

    title = " ".join(entityList[0])
    
    times = getTimes(entityList[1])
    if(times[2] == "pm"):
        times[0] = str(int(times[0].split(":")[0]) % 12 + 12 ) + ":" + times[0].split(":")[1]
    if(times[3] == "pm"):
        times[1] = str(int(times[1].split(":")[0]) % 12 + 12 ) + ":" +times[1].split(":")[1]
    startTime = times[0]
    endTime = times[1]
    
    date = getDate(entityList[2], currentDate)


    #Check for potential missing information
    if(title == ""):
        # No am or pm indicated:
        additionalPrompts.append(["title","What is your event called?"]) 
        #Additional: "is that in the morning or afternoon"
    if(startTime == ""):
        additionalPrompts.append(["startTime", "Please enter your start time in form (HH:MM) (am/pm)"])
    

    #Step 3: put these strings in 
    eventPrototype["title"] = title
    eventPrototype["startTime"] = startTime
    
    eventPrototype["endTime"] = endTime
    eventPrototype["dateMonth"] = int(date[0]) - 1 # javascript datetime 0-11
    eventPrototype["dateDay"] = date[1]
    eventPrototype["additionalPrompts"] = additionalPrompts


   
    return eventPrototype
    
    #return eventPrototype


@app.route("/fillSchedule", methods=['POST'])
def fillSchedule():
    data = request.get_json()
    dayStart = 8 # 8 am will be passed through later
    dayEnd = 22 # 10 pm
    fillerEvents = data.get('fillerEvents', [])
    fixedEvents = data.get('fixedEvents', [])
    tasks = data.get('tasks', [])
    categories = data.get('categories', [])

    generatedEvents = []
    #generatedEvents = schedule.createSchedule(dayStart, dayEnd, fixedEvents, fillerEvents, zoningSchedule)
    
    nschedule = schedule.createSchedule(dayStart, dayEnd, fixedEvents,fillerEvents, tasks, categories)

    
    #After Proccessing
    ap = {
        "generatedEvents": nschedule,
    }

    return jsonify(ap)


"""
@app.route("/fillSchedule")
def fillSchedule():
    print("received")
    # eventDescription = request.args.get('name', default="*", type=str)
    fillerEvents = request.args.get('fillerEvents', default='*', type=list)
    fixedEvents = request.args.get('fixedEvents', default='*', type=list)
    zoningSchedule = request.args.get('zoningSchedule', default='*', type=list)
    
    zoneLength = 30
    zoneHeight = 50
    
    print(fixedEvents)
   
    
    ap = {"fixedEvents": fixedEvents,
          "fillerEvents":fillerEvents,
          "zoningSchedule":zoningSchedule}


    return ap
"""



def getDate(lst, currentDate):
    """
    input:
    list of strings : lst
    output:
    MM, DD

    common forms of Dates looks for:
    None ->
    Today ->
    Tommorow ->
    Saturday ->
    Saturday March 5th ->
    Saturday the 5th ->
    the 5th -> 
    March 5th ->
    """
    
    s = " ".join(lst).lower()

    

    month_day = ["", ""]
    # month_day[0] = Month (ie 3)
    # month_day[1] = Day (ie 05)

    # Building string for patternMatching Weekday
    # add optional . after abbreviations
    monday = "monday|mon"
    tuesday = "tuesday|tues|tue|tu"
    wednesday = "wednesday|wed"
    thursday = "thursday|thurs|thur|thu|th"
    friday = "friday|fri"
    saturday = "saturday|sat" 
    sunday = "sunday|sun"
    
    

    weekdays = monday +"|"+ tuesday +"|"+ wednesday +"|"+ thursday +"|"+ friday +"|"+ saturday +"|"+ sunday
   
    #Building string patternMatching for Month
    monthsLong = "january|february|march|april|may|june|july|august|september|october|november|december"
    monthsAbv = "jan|feb|mar|apr|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec"

    months = monthsLong +"|"+ monthsAbv

    pattern = r"((?P<weekday>"+weekdays+r"))? ?(the|(?P<month>"+months+r"))? ?((?P<number>(\d?\d))(th)?(rst)?(nd)?)?" 
    
    match = re.match(pattern, s)
    currentDateMatch = re.match(r"(?P<weekday>\w+) (?P<month>\w+) (?P<number>\d|\d\d) (?P<year>\d\d\d\d) (?P<time>\d\d:\d\d:\d\d)", currentDate)
    if(match):
        
        weekday = match.group("weekday")
        month = match.group("month")
        number = match.group("number")
        
        if(month != None):
            month = translateMonth(month)
            
        else:
            month = translateMonth(currentDateMatch.group("month"))
        if(number == None and weekday == None):
            # assume date is today
            month_day[1] = int(currentDateMatch.group("number"))
        elif(number != None and weekday == None):
            month_day[1] = int(number)
        elif(number == None and weekday != None):
            month_day[1] = translateWeekday(weekday, currentDateMatch.group("weekday"), int(currentDateMatch.group("number")), calendar.monthrange(int(currentDateMatch.group("year")), int(month))[1])
        month_day[0] = month
        
    return month_day

def getTimes(lst):
    """
    input:
    list of strings : lst
    output:
    list size(2) with startTime [0], endTime [1], meridien1 [2], meridien2 [3]

    common forms Times looks for:
    11 am to 12:30 -> 11 am , 12:30 pm
    4-5 pm
    3 pm
    10 am
    10-11:30 am
    """

    # Join list of strings into one string
    s = ' '.join(lst).lower()

    # List to store results
    times = ["", "","",""]

    # Search for the time patterns
   
    match = re.match(r"((?P<first_time>\d\d:\d\d|\d:\d\d|\d\d|\d) ?(?P<first_meridiem>am|pm)?) ?(to|-)? ?((?P<second_time>\d\d:\d\d|\d:\d\d|\d\d|\d) ?(?P<second_meridiem>am|pm)?)?",s)
    if match:
        times[0] = standardizeTime(match.group("first_time"))
        times[1] = standardizeTime(match.group("second_time"))
        times[2] = match.group("first_meridiem")
        times[3] = match.group("second_meridiem")
        # reorganize the times into 24 format based on meridian time

        # Fill in missing meridian if able to imply:
        # 10 - 11 am -> 10 11 am am
        # 10:30 - 10:35 am -> 10 10 am am
        # 10 am - 11 -> 10 11 am am

        # 10 am - 1 -> 10 1 am pm | Because 1 assumed in next meridian
        # 10 - 1 pm -> 10 1 am pm | 

        # 10 - 12 pm -> 10 12 am pm 
        # 10 - 12 -> 10 12 None None
        # 12 - 2 pm -> 12 2 pm pm
        # 10 am pm
        #-----------
        if(not times[1]==None and (times[2] == None or times[3 == None])): # if second time does not exist then no meridien inference to be done
            #Just focus on hours minutes don't infer
            time1 = int(times[0].split(":")[0])
            time2 = int(times[1].split(":")[0])
            if((time1 <= time2 or time1 == 12) and time2 != 12):
                # time1 meridian == time2 meridian
                if(times[2] == None):
                    times[2] = times[3]
                else:
                    times[3] = times[2]
            elif(time1 > time2 or time2 == 12):
                if(times[2] == None):
                    times[2] = swapMeridien(times[3])
                else:
                    times[3] = swapMeridien(times[2])
            else:
                print("inference unacounted for " + times)
            


    return times

def translateWeekday(weekday, cd, cn, daysInMonth):
    """
    input: str of weekday
           str of current day
           str of current number (for day)
           int of days in month
    ex: Sat Wed 12 31
    
    output: number of weekday input

    ex: Sat Wed 12 31 -> 15
    """
    d1 = indexWeekday(weekday)
    d2 = indexWeekday(cd)
    #   4 6 -> 2
    #   4 2 -> 5
    #   29 
    val = 0
    if(d1 >= d2):
        val = cn + d1 - d2
    else:
        val = cn + 7 - d2 + d1
    if(val < daysInMonth):
        return val
    else:
        return val - daysInMonth + 1
    
def indexWeekday(weekday):
    """
    input: str of weekday
    
    output: index of weekday
    
    ex: Monday -> 1
        Sunday -> 7
    """
    weekday = weekday.lower()
    alias_dict = {"monday" : 1 , "mon" : 1,
    "tuesday" : 2 , "tues" : 2, "tue" : 2, "tu" : 2,
    "wednesday" : 3, "wed": 3,
    "thursday" : 4 , "thurs" : 4, "thur" : 4, "thu" : 4, "th": 4,
    "friday": 5, "fri" : 5,
    "saturday": 6, "sat" :6,
    "sunday": 7, "sun" : 7}
    
    return alias_dict[weekday]

def translateMonth(month):
    """
    input: string of month

    output: index of month

    ex: March -> 4
    """
    month = month.lower()
    months = ["january","february","march","april","may","june","july","august","september","october","november","december"]
    counter = 1
    for i in months:
        if month in i:
            return counter
        counter+=1
    
    print("error month " + month + " not found")
    return None

def standardizeTime(time):
    if time == None or re.match(r"\d\d:\d\d|\d:\d\d",time):
        return time
    elif(re.match(r"\d\d|\d",time)):
        return time+ ":00"
    else:
        return time

def swapMeridien(meridien):
    """
    Input: (str) am or pm

    Output: (str) opposite am or pm
    """
    if(meridien == "am"):
        return "pm"
    elif(meridien == "pm"):
        return "am"
    else:
        print("Error")
        return None

# ------TEST CASES-------
# Set to True to test getDate
cd = "Thu Aug 10 2023 15:06:25 GMT-0400 (Eastern Daylight Time)"
if(False):
    print(getDate(["Saturday"], cd)) # [8, 12]
    print(getDate(["Saturday the 5th"], cd)) # problem 5 or sat?
    print(getDate(["Saturday march 5th"], cd)) # problem 5 or sat
    print(getDate(["march 2nd"], cd)) # [2, 3]
    print(getDate(["march"], cd)) # [3]
    print(getDate(["tuesday"], cd)) #

#Set to True to test getTimes
if(False):
# Test cases
    print(getTimes(["11 am to 12:30"]))       # ['11 am', '12:30']
    print(getTimes(["4-5 Pm"]))               # ['4', '5 pm']
    print(getTimes(["3 pm"]))                 # ['3 pm', '']
    print(getTimes(["10 am"]))                # ['10 am', '']
    print(getTimes(["10-11:30 am"]))          # ['10', '11:30 am']
    print(getTimes(["10:00-11:30 am"]))          # ['10', '11:30 am']
    print(getTimes(["1:00-11:30 am"]))          # ['1', '11:30 am']
    print(getTimes(["3:00pm"]))
    print(getTimes(["11:00-1:30 pm"]))  
    print(getTimes(["12:00-2:00 pm"]))  
    print(getTimes(["10:00 am pm"])) 


if __name__ == "__main__":
    app.run(debug=True)