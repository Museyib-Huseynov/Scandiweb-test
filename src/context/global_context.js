import React from 'react'

export const GlobalContext = React.createContext()

export class GlobalProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
    }
  }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}
