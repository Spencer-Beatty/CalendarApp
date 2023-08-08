from flask import Flask, jsonify, request




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
        
    #Step 2: put those parts into eventPrototype

    eventPrototype["title"] = "Hello"

    #Step 3: return eventPrototype

    return entityList
    #return eventPrototype


if __name__ == "__main__":
    app.run(debug=True)