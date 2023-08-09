from flask import Flask, jsonify, request
import re




app = Flask(__name__)


#members API route
@app.route("/members")
def members():
    eventDescription = request.args.get('name', default = "*", type = str)
    eventPrototype = {"title": "", "startTime": "", "endTime": "", "date": ""}
    
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

    return times

def standardizeTime(time):
    if time == None or re.match(r"\d\d:\d\d|\d:\d\d",time):
        return time
    elif(re.match(r"\d\d|\d",time)):
        return time+ ":00"
    else:
        return time
    


# Test cases
print(getTimes(["11 am to 12:30"]))       # ['11 am', '12:30']
print(getTimes(["4-5 pm"]))               # ['4', '5 pm']
print(getTimes(["3 pm"]))                 # ['3 pm', '']
print(getTimes(["10 am"]))                # ['10 am', '']
print(getTimes(["10-11:30 am"]))          # ['10', '11:30 am']
print(getTimes(["10:00-11:30 am"]))          # ['10', '11:30 am']
print(getTimes(["1:00-11:30 am"]))          # ['10', '11:30 am']
print(getTimes(["3:00pm"]))


if __name__ == "__main__":
    app.run(debug=True)