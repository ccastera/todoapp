import React from 'react';
import Responsive from 'react-responsive-decorator';

class Home extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            isMobile: false
        }
    }

    componentDidMount() {
        this.props.media({ minWidth: 768 }, () => {
            this.setState({
                isMobile: false
            });
        });
        
        this.props.media({ maxWidth: 768 }, () => {
            this.setState({
                isMobile: true
            });
        });
    }

    render() {
        const { isMobile } = this.state;
        return (
            <div>
                { this.state.isMobile ?
                    <div>Mobile</div> :
                    <div>Not mobile</div> }
            </div>
        );
    }
}

export default Responsive(Home);
