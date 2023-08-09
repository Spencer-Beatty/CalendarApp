from flask import Flask, jsonify, request
import re




app = Flask(__name__)


#members API route
@app.route("/members")
def members():
    eventDescription = request.args.get('name', default = "*", type = str)
    eventPrototype = {"title": "", "startTime": "", "endTime": "", "date": "", "additionalPrompts": ""}
    
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
    startTime = times[0]
    endTime = times[1]
    date = " ".join(entityList[2])

    #Step 3: put these strings in 
    eventPrototype["title"] = title
    eventPrototype["startTime"] = startTime
    eventPrototype["endTime"] = endTime
    eventPrototype["date"] = date



    return eventPrototype
    #return eventPrototype




def getTimes(lst):
    """
    input:
    list of strings : lst
    output:
    list size(2) with startTime [0], endTime [1]

    common forms Times looks for:
    11 am to 12:30 -> 11 am , 12:30 pm
    4-5 pm
    3 pm
    10 am
    10-11:30 am
    """

    # Join list of strings into one string
    s = ' '.join(lst)

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
# Test cases
print(getTimes(["11 am to 12:30"]))       # ['11 am', '12:30']
print(getTimes(["4-5 pm"]))               # ['4', '5 pm']
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