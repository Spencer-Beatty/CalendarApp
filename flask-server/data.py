import json
# "Sentence", "{title, startTime, endTime, date}",
my_data = [
"Add meeting with the boss from 4-5 pm on Saturday", "{title: 'meeting with the boss', startTime: '4 pm', endTime: '5 pm', date: 'Saturday'}",
"Insert dentist appointment from 1-2 pm on March 5th", "{title: 'dentist appointment', startTime: '1 pm', endTime: '2 pm', date: 'March 5th'}",
"Schedule team gathering at 3 pm on July 9th", "{title: 'team gathering', startTime: '3 pm', endTime: null, date: 'July 9th'}",
"Mark family gathering at 7 pm on Sunday, June 20th", "{title: 'family gathering', startTime: '7 pm', endTime: null, date: 'Sunday, June 20th'}",
"Set up webinar from 11 am to 12 pm on September 1st", "{title: 'webinar', startTime: '11 am', endTime: '12 pm', date: 'September 1st'}",
"On 28th have client lunch at 12 pm", "{title: 'client lunch', startTime: '12 pm', endTime: null, date: '28th'}",
"Place yoga class from 6-7 pm on Friday", "{title: 'yoga class', startTime: '6 pm', endTime: '7 pm', date: 'Friday'}",
"Record doctor's visit on the 3rd of October from 9-10 am", "{title: 'doctor's visit', startTime: '9 am', endTime: '10 am', date: '3rd of October'}",
"Conference call at 10 am on Monday", "{title: 'conference call', startTime: '10 am', endTime: null, date: 'Monday'}",
"Slot in movie night at 9 pm on Wednesday", "{title: 'movie night', startTime: '9 pm', endTime: null, date: 'Wednesday'}",
"Register for the workshop from 2-3 pm on the 28th of December", "{title: 'workshop', startTime: '2 pm', endTime: '3 pm', date: '28th of December'}",
"Book club meeting at 8 pm on the 15th", "{title: 'book club meeting', startTime: '8 pm', endTime: null, date: '15th'}",
"Client presentation from 11 am to 12:30 pm on Tuesday", "{title: 'client presentation', startTime: '11 am', endTime: '12:30 pm', date: 'Tuesday'}",
"On the 17th of April, set strategy session at 10 am", "{title: 'strategy session', startTime: '10 am', endTime: null, date: '17th of April'}",
"Reserve time for a team-building event from 3-5 pm on June 12th", "{title: 'team-building event', startTime: '3 pm', endTime: '5 pm', date: 'June 12th'}",
"Note down brainstorming session on the 5th at 4 pm", "{title: 'brainstorming session', startTime: '4 pm', endTime: null, date: '5th'}",
"On Friday, conduct a performance review from 9-10 am", "{title: 'performance review', startTime: '9 am', endTime: '10 am', date: 'Friday'}",
"Plan a product launch on March 3rd at 6 pm", "{title: 'product launch', startTime: '6 pm', endTime: null, date: 'March 3rd'}",
"Add potluck dinner from 7-9 pm on the 20th", "{title: 'potluck dinner', startTime: '7 pm', endTime: '9 pm', date: '20th'}",
"Insert feedback session on August 25th from 1-2 pm", "{title: 'feedback session', startTime: '1 pm', endTime: '2 pm', date: 'August 25th'}",
"On 11th, block time for financial audit at 3 pm", "{title: 'financial audit', startTime: '3 pm', endTime: null, date: '11th'}",
"Set aside time for networking event on Sunday, 5-6 pm", "{title: 'networking event', startTime: '5 pm', endTime: '6 pm', date: 'Sunday'}",
"Technical training on April 4th from 10-11:30 am", "{title: 'technical training', startTime: '10 am', endTime: '11:30 am', date: 'April 4th'}",
"Organize a charity event on May 10th at 7 pm", "{title: 'charity event', startTime: '7 pm', endTime: null, date: 'May 10th'}",
"Stakeholder meeting on the 6th from 9-10:30 am", "{title: 'stakeholder meeting', startTime: '9 am', endTime: '10:30 am', date: '6th'}",
"Note team outing on September 18th from 5-8 pm", "{title: 'team outing', startTime: '5 pm', endTime: '8 pm', date: 'September 18th'}",
"Plan a team lunch on the 22nd at 12:30 pm", "{title: 'team lunch', startTime: '12:30 pm', endTime: null, date: '22nd'}",
"Reserve a slot for a company townhall on June 14th from 4-6 pm", "{title: 'company townhall', startTime: '4 pm', endTime: '6 pm', date: 'June 14th'}",
"Ensure to attend the product demo on Monday at 3 pm", "{title: 'product demo', startTime: '3 pm', endTime: null, date: 'Monday'}",
"Join the webinar on the 10th of September at 2 pm", "{title: 'webinar', startTime: '2 pm', endTime: null, date: '10th of September'}",
"Schedule a call with the client from 4-4:30 pm on Thursday", "{title: 'call with the client', startTime: '4 pm', endTime: '4:30 pm', date: 'Thursday'}",
"Training session at 9 am on the 23rd", "{title: 'training session', startTime: '9 am', endTime: null, date: '23rd'}",
"Book the conference room for team meet on 5th July from 3-5 pm", "{title: 'team meet', startTime: '3 pm', endTime: '5 pm', date: '5th July'}",
"Plan a surprise birthday party for Jake at 6 pm on 12th August", "{title: 'surprise birthday party for Jake', startTime: '6 pm', endTime: null, date: '12th August'}",
"On 15th June, remember to attend the town hall from 11 am-12 pm", "{title: 'town hall', startTime: '11 am', endTime: '12 pm', date: '15th June'}",
"Add workshop on advanced analytics from 2-4 pm on the 7th", "{title: 'workshop on advanced analytics', startTime: '2 pm', endTime: '4 pm', date: '7th'}",
"Note the seminar at 1 pm on the 29th of April", "{title: 'seminar', startTime: '1 pm', endTime: null, date: '29th of April'}",
"HR discussion from 10-11 am on Monday", "{title: 'HR discussion', startTime: '10 am', endTime: '11 am', date: 'Monday'}",
"Add John's farewell party at 7 pm on 25th September", "{title: 'John's farewell party', startTime: '7 pm', endTime: null, date: '25th September'}",
"Organize a project kickoff on 2nd June from 3-4:30 pm", "{title: 'project kickoff', startTime: '3 pm', endTime: '4:30 pm', date: '2nd June'}",
"Ensure to schedule a feedback round on 14th from 2-3 pm", "{title: 'feedback round', startTime: '2 pm', endTime: '3 pm', date: '14th'}",
"Plan for a department get-together on 18th August at 5 pm", "{title: 'department get-together', startTime: '5 pm', endTime: null, date: '18th August'}",
"Block time for quarterly review on 21st January from 9-11 am", "{title: 'quarterly review', startTime: '9 am', endTime: '11 am', date: '21st January'}",
"Ensure to be present for the management meet at 10 am on 5th February", "{title: 'management meet', startTime: '10 am', endTime: null, date: '5th February'}",
"Join the virtual team bonding session on Thursday from 4-6 pm", "{title: 'virtual team bonding session', startTime: '4 pm', endTime: '6 pm', date: 'Thursday'}",
"Finalize details for the campaign launch on 8th March at 3 pm", "{title: 'campaign launch', startTime: '3 pm', endTime: null, date: '8th March'}",
"Schedule time for a client feedback session on 16th from 11 am-12 pm", "{title: 'client feedback session', startTime: '11 am', endTime: '12 pm', date: '16th'}",
"Organize the annual company picnic on July 10th from 10 am-3 pm", {title: 'annual company picnic', startTime: '10 am', endTime: '3 pm', date: 'July 10th'},
"Block your calendar for a brainstorming session on 22nd at 2 pm", {title: 'brainstorming session', startTime: '2 pm', endTime: null, date: '22nd'}
]

questions = []
answers = []

print(len(my_data))
for i in range(0,len(data), 2):
    questions.append(data[i])
    answers.append(data[i+1])
    

def getIntent(wordsList):

    return 0
    

