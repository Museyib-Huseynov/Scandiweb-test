import React from 'react'

export const GlobalContext = React.createContext()

export class GlobalProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      currency: '$',
    }
  }

  setCategory = (category) => {
    this.setState({ category })
  }

  setCurrency = (currency) => {
    this.setState({ currency })
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          setCategory: this.setCategory,
          setCurrency: this.setCurrency,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}
