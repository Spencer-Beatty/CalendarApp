import copy
import re
import calendar
from datetime import datetime, timedelta
import math
import random
import pytz


def createSchedule(dayStart, dayEnd, fixedEvents, fillerEvents, tasks, categories):
    """
    This should create a zoning plan for the upcoming days
    input:
        dayStart (time) 
        dayEnd (time)
        fixedEvents (list of events) {"date" : int / str, "startTime" : str (date), "endTime" : str (date), "title": str}
        fillerEvents (list of events) {"title" : str, "duration": [int,int], "type" : str}
        tasks (list of events) {"title" : str, "timeRequired": str (form 1), "type" : str}
        categories (list of categorys) {"type" : str, "hoursAllotted": str, "timeOfDay": str}

    output:
        list of events with{
            startTime:
            endTime:
            title:
            type:
        }
    """
    dayStart = 8
    dayEnd = 22
    #Temporary variable may become an input later on, refers to how long each zone is in minute

    # Create list of time ranges by taking the start and end times from fixed events
    # [0 ] = starttime , [1] = endtime both are datetime objects (python)
    listOfTimeRanges = []
    for event in fixedEvents:
        newTimeRange = []
        # NOTE if implementing localized timeZone change this, its a hot fix
        newTimeRange.append(datetime.fromisoformat(event["startTime"][:-5]) - timedelta(hours=4))
        newTimeRange.append(datetime.fromisoformat(event["endTime"][:-5])- timedelta(hours=4))
        listOfTimeRanges.append(newTimeRange)

    #Next sort list of time Ranges
    listOfTimeRanges.sort(key=customSort)
    

    #Search for free space and create freeSpace range for each day
    
    
    freeSpace = getFreeSpaceByDate(listOfTimeRanges)
    
    days = allocateCategoryPerDay(listOfTimeRanges, timedelta(hours=12))
    print(days)
    print("FreeSpaces\n")
    for i in freeSpace:
        print(i)
        print("\n")
    
    newCalendarEvents = []
    

    
    """
    for timeRange in freeSpace:
        #put time ranges into different categories:
        timesOfDay = {"morning":[],"afternoon":[],"evening":[]}
        for start, end in timeRange:
            if(start.hour < timedelta(hours=(dayStart + (dayEnd - dayStart)/3))):
                timesOfDay["morning"].append([start,end])
            elif(start.hour < timedelta(hours=(dayStart + 2*(dayEnd - dayStart)/3))):
                timesOfDay["afternoon"].append([start,end])
            else:
                timesOfDay["evening"].append([start,end])
        for category in categories:
            if(category["timeOfDay"] != "any"):
                searchTime = timesOfDay[category["timeOfDay"]]
    """
    counter = 1       
    
    for timeRange in freeSpace:   
        print("counter",counter)
        counter+=1
        tempCategories = copy.deepcopy(categories)
        for start, end in timeRange:
            nextRange, a = fillRange(start, end, fillerEvents, tasks, tempCategories)
            for i in categories:
                print(i["hoursAllotted"] , len(categories), end=" ")
            print("\n")
            newCalendarEvents.extend(nextRange)
            
            

    
    return newCalendarEvents

def allocateCategoryPerDay(freeTimeRanges, totalTime):
    days = {1: totalTime, 2:totalTime, 3:totalTime, 4:totalTime, 5:totalTime, 6:totalTime, 7:totalTime}
    zoningMap = {1: [], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[]}
    for start, end in freeTimeRanges:
        print("1",days[start.isoweekday()])
        days[start.isoweekday()] = days[start.isoweekday()] - (end - start)
        print("2",days[start.isoweekday()])
    return days

def fillRange(start, end, fillerEvents,tasks, categories):
    """
    input:
        start (datetime) \n
        end (datetime) \n
        fillerEvents (list) type (str): {title(str), duration(int "minutes" ), priority (int)} \n
        

    output:
        events (list) {title, startTime, endTime}

    """
    """
    check what time it is
    """

    newEvents = []
    currentTime = start
    while(currentTime < end):
        if(dif(currentTime, end) < timedelta(minutes=15)):
            #Here (15) is the smallest event could be changed to fit smallest event instead
            break
        else:
            category = chooseCategory(categories)
            if(category == None):
                break
            event = fetchEvent( category, fillerEvents, tasks, maxSize=dif(currentTime, end))
            if(event is None):
                break
            categories = deAllocateHours(categories, category, event["duration"])
           
            newEvent = constructEvent(event, currentTime)
            currentTime = newEvent["endTime"]
            
            newEvents.append(newEvent)

    #This code means the calendar can only run on eastern time, but it probably wouldn't be
    #very hard to add some lines in to change to local timezone.
    eastern = pytz.timezone('US/Eastern')
    counter = 0
    for event in newEvents:
        event["startTime"] = eastern.localize(event["startTime"])
        event["endTime"] = eastern.localize(event["endTime"])
    
    return newEvents, categories



def deAllocateHours(categories, category, duration):
    for i in categories:
        if(i["type"] == category["type"]):
            i["hoursAllotted"] -= int(duration)/60
            break
    return categories

     
def constructEvent(event, currentTime):
    """
    requires date, startTime, endTime, title
    """          
    newEvent = {
        "date": currentTime.day,
        "title":event["title"],
        "type":event["type"],
        "startTime":currentTime,
        "endTime":currentTime + timedelta(minutes=int(event["duration"]))
    }
    return newEvent

def dif(time1, time2):
    
    return time2 - time1

def chooseCategory(categories):
    counter = 0
    size = len(categories)
    if(size == 0):
        return None
    while(counter < size -1 ):
        
        if(len(categories) <= 1):
            if(len(categories) == 0):
                return None
            elif(categories[0]["hoursAllotted"] > 0):
                return categories[0]
            else:
                categories.remove(categories[0])
                return None
        
        index = random.randint(0, len(categories)-1)
        attempt = categories[index]
        if(attempt["hoursAllotted"] > 0):
            return attempt
        else:
            categories.remove(attempt)
    return None

def fetchEvent(category, fillerEvents, tasks, maxSize):
    #do tasks later
    
    trimmedEvents = [i for i in fillerEvents if i["type"] == category["type"] and timedelta(minutes = int(i["duration"])) <= maxSize]
    if(len(trimmedEvents) > 0):
        return trimmedEvents[random.randrange(0, len(trimmedEvents))]
    else:
        return None



def customSort(item):
    return item[0]

def getFreeSpaceByDate(listOfTimeRanges):
    timeRangeDict = sortListOfTimeRangesByDate(listOfTimeRanges)
    days =  []
    for dayNumber in timeRangeDict.keys():
        # counts 1 through 7
        freeTimeRangesForDay = []
        timeRangesForDay = timeRangeDict[dayNumber]
        dayStart = 8
        currentDate = datetime.now()
        if(len(timeRangesForDay) <= 0):
            # .weekday() range 0-6

           
            dates = [currentDate.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=((emptyDate(currentDate.isoweekday(), dayNumber)))) ,
              currentDate.replace(hour=20, minute=0, second=0, microsecond=0) + timedelta(hours=0, days=((emptyDate(currentDate.isoweekday(), dayNumber))))]
            days.append( [dates] )
            continue
        
        currentTime = currentDate.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=((emptyDate(currentDate.isoweekday(), dayNumber))))
        dayEnd = currentDate.replace(hour=20, minute=0, second=0, microsecond=0) + timedelta(hours=0, days=((emptyDate(currentDate.isoweekday(), dayNumber))))
        counter = 0
        while(currentTime < dayEnd and counter < len(timeRangesForDay)):
            
            currentStart, currentEnd = timeRangesForDay[counter]
            if(currentTime < currentStart):
                freeTimeRangesForDay.append([currentTime, currentStart])
            if(currentTime < currentEnd):
                #This check is for when the timerange is not on the current date 
                # or there is a mixup in the order
                currentTime = currentEnd
            counter+=1
        if(counter >= len(timeRangesForDay) and currentTime <= dayEnd):
            freeTimeRangesForDay.append([currentTime, dayEnd])
            print(["time",currentTime, dayEnd],"\n")
        days.append(freeTimeRangesForDay)
    
    return days
        
        
def emptyDate(cur, dayNum):
    if(cur == dayNum):
        return 0
    elif(cur < dayNum):
         return dayNum - cur 
    else:
        return (7- cur) + dayNum


def sortListOfTimeRangesByDate(listOfTimeRanges):
    #Iso weekday means monday is 1, sunday is 7
    days = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[]}
    for start, end in listOfTimeRanges:
        days[start.isoweekday()].append([start, end])
    return days

listOfTimeRanges = [
    [datetime(2023, 8, 17, 10, 0), datetime(2023, 8, 17, 12, 0)],
    [datetime(2023, 8, 17, 14, 0), datetime(2023, 8, 17, 15, 0)],
    [datetime(2023, 8, 18, 14, 0), datetime(2023, 8, 18, 15, 0)],
    [datetime(2023, 8, 19, 14, 0), datetime(2023, 8, 19, 15, 0)],
    # Add more time ranges
]

freeMap = getFreeSpaceByDate(listOfTimeRanges)
freeMap = getFreeSpaceByDate([])


#TESTING FOR EMPTY DATE

if(False):
    print(emptyDate(1,3))
    print(emptyDate(1,1))
    print(emptyDate(5,3))
    print(emptyDate(2,1))
    print(emptyDate(1,7))
    print(emptyDate(7,1))

