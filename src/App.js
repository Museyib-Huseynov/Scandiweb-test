import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components'

class App extends React.Component {
  render() {
    return (
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navbar />} />
          </Routes>
        </BrowserRouter>
      </Wrapper>
    )
  }
}

export default App

const Wrapper = styled.main`
  display: grid;
  justify-items: center; ;
`
