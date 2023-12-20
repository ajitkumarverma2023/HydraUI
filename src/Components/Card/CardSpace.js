import React from 'react'
import '../Banner/Dashboard.css';
import PieCharts from './PieCharts';
import { useEffect ,useState} from 'react';

var jsonArr=[];
export default function CardSpace() {
  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the JSON file or an API endpoint
        const response = await fetch('Dashboard.json');
        const data = await response.json();
       // console.log(data);
        var jsonDashboard=  data && Object.keys(data["system"]).join(',');
        jsonArr=jsonDashboard.replaceAll("[","").replaceAll("]","").replaceAll('"',"").split(",");
        // Update the state with the fetched data
         console.log(jsonArr);
         setJsonData(jsonArr);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Call the fetchData function when the component mounts
    fetchData();
  }, []); 
  {var arr=JSON.stringify(jsonData).replaceAll("[","").replaceAll("]","").replaceAll('"',"").split(",")}
  console.log(arr)
        const cardsData = [
    { id: 1, title: 'Alarmed Physical Connections', content: 'Content for Card 1' },
    { id: 2, title: 'Alarmed Connections', content: 'Content for Card 2' },
    { id: 3, title: 'Pending Connections', content: 'Content for Card 3' },
    { id: 4, title: 'Alarmed ASON SNCs', content: 'Content for Card 4' },
    { id: 5, title: 'Unavailable ASON links', content: 'Content for Card 5' },
    { id: 6, title: 'Hardware Inventory', content: 'Content for Card 6' },
    // Add more cards as needed
  ];

  return (
   
    <div className="card-container">
      {cardsData.map((card) => (
  
        <div key={card.id} className="card">
          <h5>{ arr[parseInt(card.id)-1] 
          }</h5>
          <hr />
          
          <PieCharts />
          <p>{card.content}</p>
          
        </div>
      )
    
      )  }
    </div>
  );
};
 


