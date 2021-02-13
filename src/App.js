import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'


const getLocalStoredList = ()=>{
  let list= localStorage.getItem('list');
  if(list) return JSON.parse(list);
  return [];
}

function App() {
  const [name, setName]= useState('');
  const [list, setList]= useState(getLocalStoredList());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert,setAlert] = useState({show: false, msg:'', type:''});

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(!name){
      showAlert(true,'Please Enter a movie Name','danger');
    }else if(name && isEditing){
      setList(
        list.map(item=>{
          if(item.id===editId)
            item={...item,title:name}
          return item;
        })
      );
      setIsEditing(false);
      setName('');
      setEditId(null);
      showAlert(true,'Movie List Updated','success');
    }else{
      showAlert(true,'Movie Added', 'success');
      const newItem={
        id: new Date().getTime().toString(),
        title: name
      }
      setName('');
      setList([...list,newItem]);
    }
  }

  const showAlert=(show=false, msg='',type='')=>{
    setAlert({
      show,msg,type
    });
  }

  const clearList = ()=>{
    showAlert(true,'You have cleared the List','danger');
    setName('');
    setList([]);
  }

  const deleteItem =(id)=>{
    showAlert(true,'Movie Deleted','danger');
    setList(list.filter(item=> item.id!==id));
  }

  const editItem = (id)=>{
    const item=list.find(item=>item.id===id);
    setIsEditing(true);
    setEditId(id);
    setName(item.title);
  }

  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list));
  },[list])

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert?.show && <Alert {...alert} removeAlert={setAlert} list={list}/>}
        <h3>Your Movies</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="TENET" value={name} onChange={(e)=>setName(e.target.value)}/>
          <button type="submit" className="submit-btn">
            {isEditing ? 'Edit' : 'Add'}
          </button>
        </div>
      </form>
      {list.length>0 && (
        <div className="grocery-container">
          <List items={list} deleteItem={deleteItem} editItem={editItem}/>
          <button className="clear-btn" onClick={()=>clearList()}>Clear List</button>
      </div>
      )}
    </section>
  );
}

export default App
