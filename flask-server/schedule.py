import re
import calendar
from datetime import datetime, timedelta
import math


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
    
    for start, end in freeSpace:
        print(start,end)


    listOfFillerEventsToBeAdded = []
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
    current1 = start
    current2 = start + timedelta(minutes=30)
    currentZone = getZoneByTime(current2, zoningSchedule, 30)
    while(current2 < end):
        if(getZoneByTime(current2, zoningSchedule, 30) == currentZone):
            #Zone is the same as the previous block, keep going
            continue
        else:
            print(1)
            #Zone is not the same so we can fill in the current zone which is at least 30 mins

        
        #


def getZoneByTime(time, zoningSchedule, zoningMinutes):
    #Here we assume zoning schedule starts at 8 am
    index = math.floor(time.hour - 8 * (60/zoningMinutes) + time.minute/zoningMinutes)
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
        if(len(timeRangesForDay) <= 0):
            # .weekday() range 0-6
            currentDate = datetime.now()
           
            dates = [currentDate.replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=((emptyDate(currentDate.isoweekday(), dayNumber)))) ,
              currentDate.replace(hour=20, minute=0, second=0, microsecond=0) + timedelta(hours=0, days=((emptyDate(currentDate.isoweekday(), dayNumber))))]
            
            days.append( [dates] )
            continue
        cs, ce = timeRangesForDay[0]
        currentTime = datetime(cs.year, cs.month, cs.day, 8)
        dayEnd = datetime(cs.year,cs.month, cs.day, 20)
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
    if(cur > dayNum):
        return (7- cur) + dayNum
    else:
        return dayNum - cur 

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

print("FreeMapStartsHere:")
for i in freeMap:
    for s,j in i:
        print(i)
        print([s.hour, j.hour])
        