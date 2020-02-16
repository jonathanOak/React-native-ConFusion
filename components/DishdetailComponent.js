import React, { useState } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable'

function RenderDish(props) {
  const { dish } = props;

  handleViewRef = ref => this.view = ref;

  const recognizeDrag = ({ moveX, moveY, dx, dy}) => {
    if (dx < -200) 
      return true
    else
      return false
  }

  const recognizeComment = ({ moveX, moveY, dx, dy}) => {
    if (dx > 200) 
      return true
    else
      return false
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      return true
    },
    onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
    onPanResponderEnd: (e, gestureState) => {
      if (recognizeDrag(gestureState))
        Alert.alert(
          'Add to Favorites?',
          'Are you sure you wish to add ' + dish.name + ' to your favorites?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel pressed'),
              style: 'cancel'
            },
            {
              text: 'Ok',
              onPress: () => props.favorite ? console.log('Already favorite') : onPress(),
              style: 'cancel'
            }
          ],
          { cancelable: false }
        )
      if (recognizeComment(gestureState))
          props.onToggleModal()
      return true
    }
  })

  return (
    <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={this.handleViewRef} {...panResponder.panHandlers}>
      <Card
        featuredTitle={dish.name}
        image={{ uri: `${baseUrl}${dish.image}` }}>
        <Text style={{ margin: 10 }}>
          {dish.description}
        </Text>
        <View style={styles.buttonsForm}>
          <Icon
            raised
            reverse
            name={props.favorite ? 'heart' : 'heart-o'}
            type='font-awesome'
            color='#f50'
            onPress={() => props.favorite ? console.log('Already favorite') : onPress()}
          />
          <Icon
            raised
            reverse
            name='pencil'
            type='font-awesome'
            color='#512DA8'
            onPress={() => onToggleModal()}
          />
        </View>
      </Card>
    </Animatable.View>
  );
}

const shareDish = (title, message, url) => {
  Share.share({
      title: title,
      message: title + ': ' + message + ' ' + url,
      url: url
  },{
      dialogTitle: 'Share ' + title
  })
}

function RenderComments(props) {
  const { comments } = props;

  const renderCommentItem = ({ item, index }) => (
    <View key={index} style={{ margin: 10 }}>
      <Text style={{ fontSize: 14 }}>{item.comment}</Text>
      <Rating style={{ alignSelf: 'flex-start', margin: 10 }} imageSize={14} readonly startingValue={item.rating} />
      <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
    </View>
  );

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title='Comments'>
        {comments.map(comment => (
          renderCommentItem({ item: comment, index: comment.id })
        ))}
      </Card>
    </Animatable.View>
  )
}

function Dishdetail(props) {
  const { dishes } = props.dishes;
  const { comments } = props.comments;
  const favorites = props.favorites;
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(1);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');

  const dishId = props.navigation.getParam('dishId', '');
  const dish = dishes.filter(dish => dish.id === dishId)[0];

  const markFavorite = (dishId) => {
    props.postFavorite(dishId);
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const resetModalValues = () => {
    setAuthor('');
    setComment('');
    toggleModal();
  };

  const submitComment = () => {
    props.postComment(dishId, rating, author, comment);
    resetModalValues();
  };

  return (
    <View>
      <ScrollView>
        <RenderDish dish={dish} favorite={favorites.some(el => el === dishId)} onPress={() => markFavorite(dishId)} onToggleModal={toggleModal} />
        <RenderComments comments={comments.filter(comment => dishId === comment.dishId)} />
      </ScrollView>
      <Modal
        animationType='slide'
        transparent={false}
        visible={showModal}>
        <View style={styles.modalContainer}>
          <Rating
            showRating
            imagSize={20}
            minValue={1}
            startingValue={rating}
            onFinishRating={value => setRating(value)} />
          <View style={styles.modalFormGroup}>
            <Input
              placeholder='Author'
              inputStyle={{ paddingLeft: 10 }}
              leftIcon={
                <Icon
                  type='font-awesome'
                  name='user-o'
                  size={24}
                  color='black'
                />
                
              }
              value={author}
              onChangeText={(author) => setAuthor(author)}
            />
            <Input
              placeholder='Comment'
              inputStyle={{ paddingLeft: 10 }}
              leftIcon={
                <Icon
                  type='font-awesome'
                  name='comment-o'
                  size={24}
                  color='black'
                />
                
              }
              value={comment}
              onChangeText={(comment) => setComment(comment)}
            />
            <View style={styles.modalFormGroup}>
              <Button style={styles.modalButton} title='SUBMIT' color='#512DA8' onPress={() => submitComment()} />
            </View>
            <View style={styles.modalFormGroup}>
              <Button style={styles.modalButton} title='CANCEL' color='#8395a7' onPress={() => resetModalValues()} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsForm: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20
  },
  modalContainer: {
    margin: 30
  },
  modalFormGroup: {
    margin: 15
  }
});

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
};

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});


export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);