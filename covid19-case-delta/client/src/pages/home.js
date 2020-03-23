import React from 'react';
import axios from 'axios';

class Home extends React.Component {
    state = {

    }

    componentDidMount() {
        console.log("mounted");
        this.seed();
    }

    seed = () => {
        axios.get("/seed").then(
        (response) => {
            console.log(response)
        })
    }

    render() {
        return (
            <div>
                Hello!
            </div>
        )
    }
}

export default Home;