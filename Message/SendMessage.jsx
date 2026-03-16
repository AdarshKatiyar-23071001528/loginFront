import { useEffect, useState } from "react";
import api from "../src/api/axios.js";

const SendMessage = () => {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/message/contacts").then((res) => {
      // setContacts(res.data);
      console.log(res.data.result);
      setContacts(res.data.result)
    });
  }, []);

  const toggleSelect = (number) => {
    if (selected.includes(number)) {
      setSelected(selected.filter((n) => n !== number));
    } else {
      setSelected([...selected, number]);
    }
  };

  const selectAll = () => {
    const numbers = contacts.map((c) => c.mobile1);
    setSelected(numbers);
  };

  const sendMessage = async () => {
    const selectedContacts = contacts.filter((c) =>
      selected.includes(c.mobile1),
    );

    await api.post("/message/send-message", {
      contacts: selectedContacts,
      message: message,
    });

    alert("Message Sent Successfully");
  };

  return (
    <div className="">
      <div className="w-full bg-gray-300 p-2 rounded shadow">
        <p className='text-5xl font-bold mb-3 drop-shadow-lg  text-gray-500'>Send Message</p>
        <textarea
          rows="5"
          cols="40"
          className="border border-black border-2 p-2 rounded"
          placeholder="Type message"
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

    
        <div className="bg-gray-300 rounded shadow mt-4 p-2">
          
          {contacts.map((c,idx) => (
        <div key={idx} className="px-2">
          <input
            type="checkbox"
            checked={selected.includes(c.mobile1)}
            onChange={() => toggleSelect(c.mobile1)}
            className="px-2"
          />
          {c.name} - {c.mobile1}
        </div>
      ))}
      <div className="flex  items-center p-2 justify-end">
        <div className="gap-2 flex p-2">
           <button onClick={selectAll} className="bg-blue-500 px-4 py-1 rounded font-bold">Select All</button>
            <button onClick={sendMessage} className="bg-green-500 px-4 py-1 rounded font-bold">Send Message</button>
        </div>
      </div>
      
        </div>
      

    

    
    </div>
  );
};

export default SendMessage;
