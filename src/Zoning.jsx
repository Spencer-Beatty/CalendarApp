export function Zoning(){
    const dayStart = 8 //Hours
    const dayEnd= 20
    const height = 24
    const style = {
        height:`${height}px`
    }
    const top = {
        top:`${dayStart*100}px`,
        position: `relative`
    }
    return(
        <div style={top} >
        {Array.from({ length: (dayEnd-dayStart)*4 }).map((_, index) => (
            <div key={index} className="zoning-block" style={style}></div>
        ))}
        </div>
              
    )




}