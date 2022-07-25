import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar, PLP } from './components'

class App extends React.Component {
  render() {
    return (
      <Wrapper>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navbar />}>
              <Route path=':category' element={<PLP />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Wrapper>
    )
  }
}

export default App

const Wrapper = styled.main`
  display: grid;
  justify-items: center;
`
