

export const breakdownEventDescription = async(event_description, current_date) => {
    
    const data = fetch(`/members?name=${event_description}&date=${current_date}`).then(
      
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