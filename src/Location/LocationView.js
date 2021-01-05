import React from 'react';
import PropTypes from 'prop-types';
import {
  View, StyleSheet, Animated, Platform, UIManager, Image,
  TouchableOpacity, Text, ViewPropTypes
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Events from 'react-native-simple-events';
import MapView from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import AutoCompleteInput from './AutoCompleteInput';
import { Container } from 'native-base';
import { Header } from '../elements';


const PLACE_DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const DEFAULT_DELTA = { latitudeDelta: 0.015, longitudeDelta: 0.0121 };

export default class LocationView extends React.Component {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    initialLocation: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,
    markerColor: PropTypes.string,
    actionButtonStyle: ViewPropTypes.style,
    actionTextStyle: Text.propTypes.style,
    actionText: PropTypes.string,
    onLocationSelect: PropTypes.func,
    debounceDuration: PropTypes.number,
    components: PropTypes.arrayOf(PropTypes.string),
    timeout: PropTypes.number,
    maximumAge: PropTypes.number,
    enableHighAccuracy: PropTypes.bool
  };

  static defaultProps = {
    markerColor: 'black',
    actionText: 'DONE',
    onLocationSelect: () => ({}),
    debounceDuration: 300,
    components: [],
    timeout: 15000,
    maximumAge: Infinity,
    enableHighAccuracy: true
  };

  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    Events.listen('InputBlur', this.constructor.displayName, this._onTextBlur);
    Events.listen('InputFocus', this.constructor.displayName, this._onTextFocus);
    Events.listen('PlaceSelected', this.constructor.displayName, this._onPlaceSelected);
  }

  componentWillUnmount() {
    Events.rm('InputBlur', this.constructor.displayName);
    Events.rm('InputFocus', this.constructor.displayName);
    Events.rm('PlaceSelected', this.constructor.displayName);
  }

  state = {
    inputScale: new Animated.Value(1),
    inFocus: false,
    address: '',
    region: {
      ...DEFAULT_DELTA,
      ...this.props.initialLocation,
    },
  };

  _animateInput = () => {
    Animated.timing(this.state.inputScale, {
      toValue: this.state.inFocus ? 1 : 1,
      duration: 300,
    }).start();
  };

  _onMapRegionChange = region => {
    this._setRegion(region, false);
    if (this.state.inFocus) {
      this._input.blur();
    }
  };

  _onMapRegionChangeComplete = region => {
    this._input.fetchAddressForLocation(region);
  };

  _onTextFocus = () => {
    this.state.inFocus = true;
    this._animateInput();
  };

  _onTextBlur = () => {
    this.state.inFocus = false;
    this._animateInput();
  };

  _setRegion = (region, animate = true) => {
    this.state.region = { ...this.state.region, ...region };
    if (animate) this._map.animateToRegion(this.state.region);
  };

  _onPlaceSelected = placeId => {
    this._input.blur();
    axios.get(`${PLACE_DETAIL_URL}?key=${this.props.apiKey}&placeid=${placeId}`).then(({ data }) => {
      let region = (({ lat, lng }) => ({ latitude: lat, longitude: lng }))(data.result.geometry.location);
      this._setRegion(region);
      this.setState({ placeDetails: data.result });
    });
  };

  _getCurrentLocation = () => {
    const { timeout, maximumAge, enableHighAccuracy } = this.props;
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        this._setRegion({ latitude: location.latitude, longitude: location.longitude });
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  };

  render() {
    let { inputScale, address } = this.state;
    const { navigation } = this.props;
    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Header navigation={navigation} color={'transparent'} title={'Địa điểm yêu thích'} />
        <View style={styles.container}>
          <MapView
            ref={mapView => (this._map = mapView)}
            style={styles.mapView}
            region={this.state.region}
            showsMyLocationButton={true}
            showsUserLocation={false}
            onPress={({ nativeEvent }) => this._setRegion(nativeEvent.coordinate)}
            onRegionChange={this._onMapRegionChange}
            onRegionChangeComplete={this._onMapRegionChangeComplete}
          />
          <Entypo
            name={'location-pin'}
            size={30}
            color={this.props.markerColor}
            style={{ backgroundColor: 'transparent' }}
          />
          <View style={styles.fullWidthContainer}>
            <AutoCompleteInput
              ref={input => (this._input = input)}
              apiKey={this.props.apiKey}
              style={[styles.input, { transform: [{ scale: inputScale }] }]}
              debounceDuration={this.props.debounceDuration}
              components={this.props.components}
              getAddress={address => this.setState({ address })}
            />
          </View>
          <TouchableOpacity
            style={[styles.currentLocBtn, { backgroundColor: this.props.markerColor }]}
            onPress={this._getCurrentLocation}
          >
            <MaterialIcons name={'my-location'} color={'white'} size={25} />
          </TouchableOpacity>
          <View
            style={styles.actionButton}
          >
            <Text style={{ flex: 8, fontSize: 16, fontWeight: 'bold' }}>
              {address}
            </Text>
            <TouchableOpacity
              onPress={() => console.log(this.state.region)}
            >
              <Image
                style={{ width: 50, height: 50, opacity: 1 }}
                source={require('../../assets/images/green_check.png')}
              />
            </TouchableOpacity>
          </View>
          {this.props.children}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  fullWidthContainer: {
    position: 'absolute',
    width: '100%',
    top: 10,
    alignItems: 'center',
  },
  input: {
    width: '96%',
    padding: 5,
  },
  currentLocBtn: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 150,
    right: 10,
  },
  actionButton: {
    backgroundColor: 'white',
    height: 100,
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 23,
  }
});
