import React from 'react'

export const GlobalContext = React.createContext()

export class GlobalProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      currency: '$',
      cartProducts: [],
      smallCartOpen: false,
    }
  }

  componentDidMount() {
    if (this.state.smallCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
    }
  }

  componentDidUpdate() {
    if (this.state.smallCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
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

  setSmallCartOpen = () => {
    this.setState({ smallCartOpen: !this.state.smallCartOpen })
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          setCategory: this.setCategory,
          setCurrency: this.setCurrency,
          setCartProducts: this.setCartProducts,
          setSmallCartOpen: this.setSmallCartOpen,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}
