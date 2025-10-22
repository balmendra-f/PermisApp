import React, { Component } from "react";
import { Animated, StyleSheet, Text, TextInput, View } from "react-native";
import { number, object, string } from "prop-types";

export class FloatingTitleTextInputField extends Component {
  static propTypes = {
    title: string.isRequired,
    keyboardType: string,
    titleActiveSize: number, // to control size of title when field is active
    titleInActiveSize: number, // to control size of title when field is inactive
    titleActiveColor: string, // to control color of title when field is active
    titleInactiveColor: string, // to control color of title when field is active
    textInputStyles: object,
    otherTextInputProps: object,
  };

  static defaultProps = {
    keyboardType: "default",
    titleActiveSize: 14,
    titleInActiveSize: 16,
    titleActiveColor: "gray",
    titleInactiveColor: "dimgrey",
    textInputStyles: {},
    otherTextInputAttributes: {},
  };

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.state = {
      isFieldActive: false,
      isFocused: false,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.value !== this.props.value) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }

  _handleFocus = () => {
    this.setState({ isFocused: true });

    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });

      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  _handleBlur = () => {
    this.setState({ isFocused: false });
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    const {
      titleActiveColor,
      titleInactiveColor,
      titleActiveSize,
      titleInActiveSize,
    } = this.props;

    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
      marginTop: isFieldActive ? -15 : -5,
    };
  };

  render() {
    const { isFocused } = this.state;
    return (
      <View>
        <View
          style={{
            ...Styles.container,
            borderBottomWidth: isFocused ? 1 : 0.5,
            borderBottomColor: isFocused ? "#6244bb" : "lightgray",
            flexDirection: "row",
          }}
        >
          <Animated.Text
            style={[Styles.titleStyles, this._returnAnimatedTitleStyles()]}
          >
            {this.props.title}
          </Animated.Text>
          <TextInput
            value={this.props.value}
            style={[
              Styles.textInput,
              this.props.textInputStyles,
              {
                backgroundColor: "transparent",
                flex: 1,
              },
            ]}
            underlineColorAndroid="transparent"
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            onChangeText={(val) => {
              this.props.onChange(val);
            }}
            editable={!this.props.selectionField}
            pointerEvents={this.props.selectionField ? "none" : "auto"}
            autoFocus={this.props.autoFocus}
            keyboardType={this.props.keyboardType}
            secureTextEntry={this.props.secureTextEntry}
            onEndEditing={this.props.onEndEditing}
            {...this.props.otherTextInputProps}
          />
          {/**this.props.showIcon && (
            <Icon
              name={this.props.iconName}
              onPress={this.props.iconAction}
              style={{
                fontSize: 22,
                color: "#a7a7a7",
              }}
            />
          )**/}
        </View>
        {this.props.error && this.props.touched && (
          <Text
            style={{ color: "salmon", alignSelf: "flex-end", marginRight: 5 }}
          >
            {this.props.error}
          </Text>
        )}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 3,
    borderStyle: "solid",
    borderBottomWidth: 1,
    marginVertical: 5,
    marginTop: 20,
  },
  textInput: {
    fontSize: 16,
    color: "black",
    height: 42,
    marginBottom: -5,
  },
  titleStyles: {
    position: "absolute",
  },
});
