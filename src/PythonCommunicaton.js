

export const breakdownEventDescription = async(event_description) => {
    
    const data = fetch(`/members?name=${event_description}`).then(
      
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