


export const breakdownEventDescription = async(event_description, current_date) => {
    
    const data = fetch(`https://spencerb320.pythonanywhere.com//members?name=${event_description}&date=${current_date}`).then(
      
      res => res.json()
    ).then(
      data => {
        
        console.log(data)
        return data
      }
    ).catch(
      error => console.log('Error:', error)
    )
  return data
};


export const fillSchedule = async (fillerEvents, fixedEvents, tasks, categories) => {
  const response = await fetch(`https://spencerb320.pythonanywhere.com/fillSchedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fillerEvents: fillerEvents,
      fixedEvents: fixedEvents,
      tasks: tasks,
      categories: categories,
    }),
  });

  const data = await response.json();
  console.log(data);
  return data;
};
/*
#
export const fillSchedule = async(fillerEvents, fixedEvents, zoningBlocks ) => {

  const data = fetch(`/fillSchedule?fillerEvents=${encodeURIComponent(JSON.stringify(fillerEvents))}&fixedEvents=${JSON.stringify(fixedEvents)}&zoningBlocks=${encodeURIComponent(JSON.stringify(zoningBlocks))}`).then(
    res => res.json()
  ).then(
    data => {
      console.log(data.fixedEvents)
      return data
    }
  ).catch(
    error => console.log('Error:', error)
  )
  return data
};*/