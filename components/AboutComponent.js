import React, { Component } from 'react';
import { Loading } from './LoadingComponent';
import { ScrollView, Text, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { LEADERS } from '../shared/leaders';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      leaders: state.leaders
    }
  }

 class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaders: LEADERS
        };
    }

    static navigationOptions = {
        title: 'About Us'
    };

     render() {

        const renderLeaders = ({item, index}) => {
            return (
                    <ListItem
                        key={index}
                        title={item.name}
                        titleStyle = {{color: 'black'}}
                        subtitle={item.description}
                        hideChevron={true}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                    />
            );
        };

        if (this.props.leaders.isLoading) {
            return(
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                        <Text>{this.props.leaders.errMess}</Text>
                    </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
        else if (this.props.leaders.errMess) {
            return(
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                    <FlatList 
                        data={this.props.leaders.leaders}
                        renderItem={renderLeader}
                        keyExtractor={item => item.id.toString()}
                        />
                    </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
        else {
            return(
                <ScrollView>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                    <FlatList 
                        data={this.props.leaders.leaders}
                        renderItem={renderLeader}
                        keyExtractor={item => item.id.toString()}
                        />
                    </Card>
                </ScrollView>
            );
        }
    }

       
    
}

export default connect(mapStateToProps)(About);