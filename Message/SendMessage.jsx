import { useEffect, useState } from "react";
import api from "../src/api/axios.js";

const SendMessage = () => {

  const [contacts,setContacts] = useState([]);
  const [selected,setSelected] = useState([]);
  const [message,setMessage] = useState("");

  useEffect(()=>{

    api.get("/contacts")
    .then(res=>{
      setContacts(res.data)
    })

  },[]);

  const toggleSelect = (number)=>{

    if(selected.includes(number)){
      setSelected(selected.filter(n=>n!==number))
    }else{
      setSelected([...selected,number])
    }

  }

  const selectAll = ()=>{

    const numbers = contacts.map(c=>c.number)
    setSelected(numbers)

  }

  const sendMessage = async ()=>{

    const selectedContacts = contacts.filter(c =>
      selected.includes(c.number)
    )

    await api.post("/send-message",{
      contacts:selectedContacts,
      message:message
    })

    alert("Message Sent Successfully")

  }

  return(

    <div style={{padding:"40px"}}>

      <h2>Send Message</h2>

      <textarea
        rows="5"
        cols="40"
        className="border border-gray-200 border-1 p-2 rounded"
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

  )

}

export default SendMessage;