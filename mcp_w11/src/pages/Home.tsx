import { IonAvatar, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

const Home: React.FC = () => {
  const db = getFirestore();
  const [students, setStudents] = useState<Array<any>>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [filename, setFileName] useState('');
  const storage = getStorage();
  const nim = useRef<HTMLIonInputElement>(null);
  const nama = useRef<HTMLIonInputElement>(null);
  const prodi = useRef<HTMLIonInputElement>(null);

  const addData = async (url : string) => {
    try {
      const docRef = await addDoc(collection ( db, 'students'), {
        nim : nim.current?.value,
        nama : nama.current?.value,
        prodi : prodi.current?.value,
        foto : filename,
        fotoUrl : url
      });
      console.log("Document written with ID: ", docRef.id);
    }catch (e){
      console.error("Error adding document: ", e);
    }
  }

  const fileChangeHandler = (event: React.ChangeEventHandler<HTMLInputElement> ) => {
    setSelectedFile(event.target!.files![0]);
    setFileName(event.target!.files![0].name);
  };

  const insertHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const storageRef = ref(storage, fileName);
    uploadBytes(storageRef, selectedFile as Blob).then((snapshot) => {
      console.log('úpload file success');
      getDownloadURL(ref(storage, fileName)).then((url) => {
        addData(url);
      })
    })
  };

  /* useEffect( ( ) => {
    const addData = async () => {
      try { 
        const docRef = await addDoc(collection (db, 'users'), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    addData();
  }) */
  useEffect(() => {
    async function getData() {
      const querySnapshot = await getDocs(collection(db, "students"));
      console.log('querySnapshot: ', querySnapshot);
      setStudents(querySnapshot.docs.map((doc) => ({ ... doc.data(), id: doc.id})));

      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        console.log('doc: ', doc);
      })
    }

    getData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
        <input type = 'file' onChange = {fileChangeHandler}/>
        <IonButton onClick = {insertHandler}> Simpan</IonButton>
        <IonItem>
          <IonLabel position= 'floating'>NIM</IonLabel>
          <IonInput ref = { nim }></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position= 'floating'>Nama</IonLabel>
          <IonInput ref = { nama }></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position= 'floating'>Prodi</IonLabel>
          <IonInput ref = { prodi }></IonInput>
        </IonItem>
        <IonItem>
          <input type = 'file' onChange = { fileChangeHandler } />
        </IonItem>
        <IonButton onClick = { insertHandler } > Simpan </IonButton>
        <IonList>
          {students.map(student => (
            <IonItem key = {student.id}>
              <IonAvatar slot = 'start'>
                <img src { student.fotoUrl}/>
              </IonAvatar>
              <IonLabel>
                {student.nim}<br/>
                {student.nama}<br/>
                {student.prodi}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
