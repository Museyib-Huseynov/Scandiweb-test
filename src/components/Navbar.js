import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { GET_CATEGORIES_AND_CURRENCIES } from '../gql'

function hooksHOC(Component) {
  return function WrappedComponent(props) {
    const { loading, error, data } = useQuery(GET_CATEGORIES_AND_CURRENCIES)
    console.log(data)
    return <Component {...props} fetchedData={{ loading, error, data }} />
  }
}

class Navbar extends React.Component {
  render() {
    const { loading, error, data } = this.props.fetchedData

    if (loading) return null
    if (error) return null
    return (
      <Wrapper>
        <ul className='categories-ul'>
          {data.categories.map((item) => {
            return (
              <li key={item.name} className='categories-li'>
                {item.name}
              </li>
            )
          })}
        </ul>
      </Wrapper>
    )
  }
}

export default hooksHOC(Navbar)

const Wrapper = styled.header`
  width: 1440px;
  height: 80px;
  position: relative;
  background: red;

  .categories-ul {
    list-style-type: none;
    height: 52px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: absolute;
    left: 101px;
    bottom: 0px;
  }

  .categories-li {
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 16px;
    padding: 0 16px;
    text-transform: uppercase;
    cursor: pointer;
  }
`
