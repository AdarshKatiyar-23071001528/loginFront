import { useEffect, useState } from "react";
import api from "../src/api/axios";

const SendMessage = () => {

  const [contacts,setContacts] = useState([]);
  const [selected,setSelected] = useState([]);
  const [message,setMessage] = useState("");

  useEffect(()=>{

    api.get("/contacts")
    .then(res=>setContacts(res.data));

  },[]);

  const toggleSelect = (number)=>{

    if(selected.includes(number)){
      setSelected(selected.filter(n=>n!==number));
    }else{
      setSelected([...selected,number]);
    }

  };

  const selectAll = ()=>{

    const numbers = contacts.map(c=>c.number);
    setSelected(numbers);

  };

  const sendMessage = async ()=>{

    await api.post("/send-message",{
      numbers:selected,
      message:message
    });

    alert("Message Sent");

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>WhatsApp Bulk Sender</h2>

      <textarea
        placeholder="Type message"
        onChange={(e)=>setMessage(e.target.value)}
      />

      <br/><br/>

      <button onClick={selectAll}>
        Select All
      </button>

      <br/><br/>

      {contacts.map(c=>(
        <div key={c.id}>

          <input
            type="checkbox"
            checked={selected.includes(c.number)}
            onChange={()=>toggleSelect(c.number)}
          />

          {c.name} - {c.number}

        </div>
      ))}

      <br/>

      <button onClick={sendMessage}>
        Send Message
      </button>

    </div>

  );

}

export default SendMessage;
