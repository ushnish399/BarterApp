import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableHighlight,} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books';
import {SearchBar, ListItem} from 'react-native-elements';

export default class ObjectRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      objectName:"",
      reasonToRequest:"",
      IsObjectRequestActive : "",
      requestedObjectName: "",
      ObjectStatus:"",
      requestId:"",
      userDocId: '',
      docId :'',
      imageLink:'',
      dataSource:'',
      showFlatlist: false,
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (objectName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    var objects=await ObjectSearch.searchObject(objectName, "AIzaSyBlfTkWaVTb59oU59fbFpP-PE368ogYKCw")
    db.collection('requested_objects').add({
        "user_id": userId,
        "object_name":objectName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "object_status" : "requested",
        "date"       : firebase.firestore.FieldValue.serverTimestamp(),
        "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail,

    })

    await  this.getObjectRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsObjectRequestActive: true
      })
    })
  })

    this.setState({
        objectName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert("Object Requested Successfully")


  }

receivedObjects=(objectName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_objects').add({
      "user_id": userId,
      "object_name":objectName,
      "request_id"  : requestId,
      "objectStatus"  : "received",

  })
}




getIsObjectRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsObjectRequestActive:doc.data().IsObjectRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getObjectRequest =()=>{
  // getting the requested book
var objectRequest=  db.collection('requested_objects')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().object_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedObjectName: doc.data().object_name,
          objectStatus:doc.data().object_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var objectName =  doc.data().object_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the object " + objectName ,
            "notification_status" : "unread",
            "object_name" : objectName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getObjectRequest()
  this.getIsObjectRequestActive()

}

updateObjectRequestStatus=()=>{
  //updating the book status after receiving the book
  db.collection('requested_objects').doc(this.state.docId)
  .update({
    object_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsObjectRequestActive: false
      })
    })
  })


}

async getObjectsFromApi(objectName){
 this.setState({
   objectName:objectName,
   })
 if(objectName.length>2){
var objects=await ObjectSearch.searchobject(objectName, "AIzaSyBlfTkWaVTb59oU59fbFpP-PE368ogYKCw");
this.setState({dataSource:objects.data, showFlatlist:true})
 }
}
renderItem=({item, i})=>{
var obiject={
  title:item.volumeInfo.title,
  selfLink:item.selfLink,
  buyLink:item.saleInfo.buyLink,
  imageLink:item.volumeInfo.imageLinks,
}
return(
  <TouchableHighlight style={{alignItems:'center', backgroundColor:'#dddddd', padding:10, width:'90%'}} activeOpacity={0.6} underlayColor='dddddd' onPress={()=>{this.setState({showFlatlist:false, bookName:item.volumeInfo.title})}} bottomDivider>
    <Text>{item.volumeInfo.title}</Text>
  </TouchableHighlight>
)
}



  render(){

    if(this.state.IsObjectRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Object Name</Text>
          <Text>{this.state.requestedObjectName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Object Status </Text>

          <Text>{this.state.objectStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateObjectRequestStatus();
            this.receivedObjects(this.state.requestedObjectName)
          }}>
          <Text>I recieved the object </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Object" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter object name"}
                onChangeText={(text)=>{
                   this.getObjectsFromApi('')
                       
                }}
                value={this.state.objectName}
              />
              {this.state.showFlatlist ? (<Flatlist data={this.state.dataSource} renderItem={this.renderItem} enableEmptySections={true} style={{marginTop:10}} keyExtractor={(item, index)=>{index.toString()}}></Flatlist>) : (
              <View style={{alignItems:'center'}}>
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need this object"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.objectName,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>
              </View>
              )
    }
            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
