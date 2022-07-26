import React from 'react'

export const GlobalContext = React.createContext()

export class GlobalProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      currency: '$',
      cartProducts: [],
    }
  }

  setCategory = (category) => {
    this.setState({ category })
  }

  setCurrency = (currency) => {
    this.setState({ currency })
  }

  setCartProducts = (cartProducts) => {
    this.setState({ cartProducts })
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          setCategory: this.setCategory,
          setCurrency: this.setCurrency,
          setCartProducts: this.setCartProducts,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}
