import { addDoc, collection, doc, getDocs, query, setDoc, where, deleteDoc } from "@firebase/firestore";
import { fireStoreApp } from "../API/firebaseApp";
import { Events } from "../components/Dashboard/context/SchedulerProvider";
const dbInstance = collection(fireStoreApp, "task");

export const getAllUserEventsService = async (
  userUid: string
): Promise<any> => {
  const q = query(dbInstance, where("userUid", "==", userUid));
  const eventsList = await getDocs(q).then((data) => {
    return data.docs.map((task) => {
      return { ...task.data() };
    });
  });
  return eventsList;
};

export const addNewEventService = async (newEvent: Events):Promise<Events> => {
  return await addDoc(dbInstance, newEvent).then((data) => {
    //Caso o documento seja salvo
    return {
      ...newEvent,
      id: data.id,
    };
  });
};

export const upgradeEventService = async (modifiedEvent: Events) => {
    try{
      const refDoc = doc(dbInstance, modifiedEvent.id);
      const returnEvent = await setDoc(refDoc, modifiedEvent).then((event)=>{
          console.log("evento retornado", event)
      })
    } catch(e){
      console.log("Error", e)
    }
}

export const deleteEventService = async (eventId: string) => {
  try {
    const refDoc = doc(dbInstance, eventId);
    const returnEvent = await deleteDoc(refDoc).then((event)=>{
        console.log("evento retornado", event)
    })
  } catch (e){
    console.log("Error", e)
  }
}