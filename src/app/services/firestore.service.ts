import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, where, query } from "firebase/firestore";
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  async getDocs(col: string) {
    const querySnapshot = await getDocs(collection(this.firestore, col));
    let arr: any = [];
    querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
      let item: any = doc.data();
      item.ID = doc.id;
      arr.push(item);
    });
    console.log(arr);
    return arr;
  }

  async getBetweenDates(col: string, firstDay: Date, lastDay: Date) {
    const q = query(collection(this.firestore, col), where('fecha', '>=', firstDay), where('fecha', '<=', lastDay));
    const querySnapshot = await getDocs(q);
    let arr: any = [];
    querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
      let item: any = doc.data();
      item.ID = doc.id;
      arr.push(item);
    });
    console.log(arr);
    return arr;

  }

  async createDoc(col: string, data: any) {
    const docRef = await addDoc(collection(this.firestore, col), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  }

  async getDeepDocs(col: string, docId: string, col2: string) {
    const firstRef = doc(this.firestore, col, docId);
    const querySnapshot = await getDocs(collection(firstRef, col2));
    let arr: any = [];
    querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
      let item: any = doc.data();
      item.ID = doc.id;
      arr.push(item);
    });
    console.log(arr);
    return arr;
  }

  async createDeepDoc(col: string, docId: string, col2: string, data: any) {
    const firstRef = doc(this.firestore, col, docId);
    const docRef = await addDoc(collection(firstRef, col2), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  }

  async deleteDeepDoc(col: string, docId: string, col2: string, id: string) {
    const firstRef = doc(this.firestore, col, docId);
    await deleteDoc(doc(firstRef, col2, id));
    console.log("Document deleted with ID: ", id);
  }

  async updateDoc(col: string, id: string, data: any) {
    await updateDoc(doc(this.firestore, col, id), data);
    console.log("Document updated with ID: ", id);
  }

  async deleteDoc(col: string, id: string) {
    await deleteDoc(doc(this.firestore, col, id));
    console.log("Document deleted with ID: ", id);
  }
}
