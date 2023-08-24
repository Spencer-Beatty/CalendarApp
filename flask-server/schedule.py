import re
import calendar
from datetime import datetime, timedelta
import math
import random
import pytz


def createSchedule(dayStart, dayEnd, fixedEvents, fillerEvents, zoningSchedule):
    """
    This should create a zoning plan for the upcoming days
    input:
        dayStart (time) 
        dayEnd (time)
        fixedEvents (list of events) {"date" : int / str, "startTime" : str (date), "endTime" : str (date), "title": str}
        fillerEvents (list of events) {"title" : str, "duration": [int,int], "type" : str}
        zoningSchedule (list of events) {"schedule" : [str]}

    output:
        list of events with{
            startTime:
            endTime:
            title:
            type:
        }
    """
    #Temporary variable may become an input later on, refers to how long each zone is in minutes
    zoningMinutes = 30

    #Create list of time ranges by taking the start and end times from fixed events
    # [0 ] = starttime , [1] = endtime both are datetime objects (python)
    listOfTimeRanges = []
    for event in fixedEvents:
        newTimeRange = []
        newTimeRange.append(datetime.fromisoformat(event["startTime"][:-5]))
        newTimeRange.append(datetime.fromisoformat(event["endTime"][:-5]))
        listOfTimeRanges.append(newTimeRange)

    #Next sort list of time Ranges
    listOfTimeRanges.sort(key=customSort)
    print("\n")
    for i in listOfTimeRanges:
        print(i[0])
    print("\n")

    #Search for free space and create freeSpace range for each day

    freeSpace = getFreeSpaceByDate(listOfTimeRanges)
    
    freeSpaceList = []
    print("FreeSpaces\n")
    for timeRange in freeSpace:
        for start, end in timeRange:
            print(start, end)
            freeSpaceList.extend(fillRange(start, end, fillerEvents, zoningSchedule))
    
    
    return freeSpaceList

    

    
    #Go through free space picking filler events to add based on zoning
    #Find size of zoning by running forward until either hitting a difffernt type of
    #Zoning or reaching the end of the freeSpace
    """
    for space in freeSpace:
        events = []
        start = freeSpace[0]
        currentZone = getZoneByTime(start, zoningSchedule, zoningMinutes, dayStart, dayEnd)
        while(start>freeSpace[1]):
            #
            fillSpace(space, fillerEvents, zoningSchedule)
            """


def fillRange(start, end, fillerEvents, zoningSchedule):
    """
    input:
        start (datetime) \n
        end (datetime) \n
        fillerEvents (list) type (str): {title(str), duration(int "minutes" ), priority (int)} \n
        zoningSchedule (list) [str]

    output:
        events (list) {title, startTime, endTime}

    """
    events = []
    current1 = start
    current2 = start #Inititalize variable
    #Set current2 to be equal to the start of the next zone that way we can iterate through
    #Zones by simply adding the zoning minutes
    if(start.minute < 30):
        current2 = start.replace(minute=30)
    else:
        current2 = start.replace(minute=0) + timedelta(hours=1)
    currentZone = getZoneByTime(current1, zoningSchedule, 30)
    print("Starting While loop")
    while(current2 < end):
        
        if(getZoneByTime(current2, zoningSchedule, 30) == currentZone):
            #Zone is the same as the previous block, keep going
            current2 += timedelta(minutes=30)
            continue
        else:
            #Zone is not the same so we can fill in the space 
            #from current1 to current2 then set current1 to current2 and extend current2
            options = [element for element in fillerEvents if element["type"] == currentZone]
            size = current2 - current1
            while(size > timedelta(hours=0)):
                option = pickOption(size, options)
                if(option == None):
                    size = timedelta(hours=0)
                    continue
                eventLength = timedelta(minutes=int(option["duration"]))
                size = size - eventLength
                events.append({"title": option["title"],"startTime":current1, "endTime":current1+eventLength, "type":currentZone})
                current1 += eventLength
            current1 = current2
            currentZone = getZoneByTime(current1, zoningSchedule, 30)
            current2 += timedelta(minutes=30)
            
    #Deal with current1 to end
    print(fillerEvents)
    options = [element for element in fillerEvents if element["type"] == currentZone]
    print(options)
    size = end - current1
    while(size > timedelta(hours=0)):
                option = pickOption(size, options)
                if(option == None):
                    size = timedelta(hours=0)
                    continue
                eventLength = timedelta(minutes=int(option["duration"]))
                size = size - eventLength
                events.append({"title": option["title"],"startTime":current1, "endTime":current1+eventLength, "type":currentZone})
                current1 += eventLength
    print("Events")
    return events

                
            



def pickOption(size, options):
    """
    size: timedelta object

    options: list filler items for that zone,
             traits ( title, duration, type, priority)

    output:
        chosen: ( title, duration, type, priority)
    """
    potentials = []
    for i in options:
        if(int(i["duration"]) <= size.seconds / 60):
            potentials.append(i)

    #For now just returns a random size
    if(len(potentials) == 0):
        return None
    else:
        return potentials[random.randrange(0,len(potentials))]


def getZoneByTime(time, zoningSchedule, zoningMinutes):
    #Here we assume zoning schedule starts at 8 am
    index = math.floor((time.hour - 8) * (60/zoningMinutes) + time.minute/zoningMinutes)
    print(index)
    return zoningSchedule[ index ]



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
            currentTime = currentEnd
            counter+=1
        if(counter >= len(timeRangesForDay) and currentTime <= dayEnd):
            freeTimeRangesForDay.append([currentTime, dayEnd])
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

if(True):
    print(emptyDate(1,3))
    print(emptyDate(1,1))
    print(emptyDate(5,3))
    print(emptyDate(2,1))
    print(emptyDate(1,7))
    print(emptyDate(7,1))

