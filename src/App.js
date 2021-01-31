import React,{Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const app = new clarifai.App({
		apiKey: '016077dcccf04769948274bb87018fab'


});




const particlesOptions ={
			particles:{
				number:{
					value:100,
					density:{
						enable:true,
						value_area:800
					}

				}
					

			}


}

class App extends Component{
		constructor(){
				super();
				this.state = {
					input: '',
					imageUrl:'',
					route: 'signin',
					isSignedIn: false,
					user: {
					        id: '',
					        name: '',
					        email: '',
					        entries: 0,
					        joined: ''
					      }
				}

		}


		loadUser = (data) => {
    		this.setState({user: {
							      id: data.id,
							      name: data.name,
							      email: data.email,
							      entries: data.entries,
							      joined: data.joined
							    }
							}
							    )
  }




		componentDidMount() {
			fetch('http://localhost:3000/')
				.then(response => response.json())
				.then(console.log)
		}


		onInputChange = (event) =>{
			this.setState({input:event.target.value});
		}


		onButtonSubmit = () =>{

			this.setState({imageUrl: this.state.input});
			app.models.predict(

				clarifai.COLOR_MODEL,
				"https://samples.clarifai.com/metro-north.jpg").then(
			response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));



		}
onRouteChange = (route) => {
	if(route === 'signout'){
		this.setState({isSignedIn: false})
	}else if (route === 'home'){
		this.setState({isSignedIn: true})
	}



	this.setState({route: route});
}		

  render(){
  	const { isSignedIn, imageUrl,route} = this.state;
    return(

          <div className="App">
          	<Particles className='particles'
                params={particlesOptions}/>

            <Navigation isSignedIn={isSignedIn}

	             onRouteChange={this.onRouteChange}/>
            {	route ==='home' 
            	
            	?<div> 
            		<Logo/>
       				<ImageLinkForm 
       						onInputChange={this.onInputChange} 
       						onButtonSubmit={this.onButtonSubmit}/>
       				<Rank/>     
       				<FaceRecognition imageUrl={imageUrl}/>
       		
       			</div>
       			:(
       			route === 'signin' 
       			?<SignIn onRouteChange={this.onRouteChange} />
       			:<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
       			)
       			
       		}


          </div>







      );
  }
}

export default App;
