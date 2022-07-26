import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'
import { useNavigate, Outlet } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_CATEGORIES_AND_CURRENCIES } from '../gql'
import { SmallCart } from '.'

import { logo, arrowUp, arrowDown, cart } from '../static'

function hooksHOC(Component) {
  return function WrappedComponent(props) {
    const { loading, error, data } = useQuery(GET_CATEGORIES_AND_CURRENCIES)
    const navigate = useNavigate()
    return (
      <Component
        {...props}
        fetchedData={{ loading, error, data }}
        navigate={navigate}
      />
    )
  }
}

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currencyArrowOpen: false,
      smallCartOpen: false,
    }
    this.ref = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  static contextType = GlobalContext

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside(event) {
    if (this.ref && !this.ref.current.contains(event.target)) {
      this.setState({ currencyArrowOpen: false })
    }
  }

  render() {
    const { loading, error, data } = this.props.fetchedData
    const { category, setCategory, currency, setCurrency, cartProducts } =
      this.context

    const totalAmount = cartProducts.reduce((acc, item) => {
      return acc + item.amount
    }, 0)

    if (loading) return null
    if (error) return null
    return (
      <Wrapper>
        <ul className='categories-ul'>
          {data.categories.map((item) => {
            return (
              <li
                key={item.name}
                className={
                  category === item.name
                    ? 'categories-li activeMenu'
                    : 'categories-li'
                }
                onClick={() => {
                  setCategory(item.name)
                  this.props.navigate(`/${item.name}`)
                }}
              >
                {item.name}
              </li>
            )
          })}
        </ul>

        <img
          src={logo}
          alt='logo'
          className='logo'
          onClick={() => {
            setCategory('')
            this.props.navigate('/')
          }}
        />

        <div className='actions'>
          <div
            className='currency-container'
            onClick={() =>
              this.setState({
                currencyArrowOpen: !this.state.currencyArrowOpen,
              })
            }
            ref={this.ref}
          >
            <p className='currency'>{currency}</p>
            <img
              src={this.state.currencyArrowOpen ? arrowUp : arrowDown}
              alt='arrow'
              className='arrow'
            />
            <div
              className={
                this.state.currencyArrowOpen
                  ? 'chooseCurrencyContainer show'
                  : 'chooseCurrencyContainer'
              }
            >
              {data.currencies.map((item) => {
                return (
                  <p
                    key={item.symbol}
                    className={
                      currency === item.symbol
                        ? 'currencyOption activeCurrency'
                        : 'currencyOption'
                    }
                    onClick={(e) => {
                      setCurrency(item.symbol)
                      this.setState({ currencyArrowOpen: false })
                    }}
                  >{`${item.symbol} ${item.label}`}</p>
                )
              })}
            </div>
          </div>

          <div className='cart-icon-container'>
            <div
              onClick={() =>
                this.setState({ smallCartOpen: !this.state.smallCartOpen })
              }
            >
              <img src={cart} alt='cart' />
              {totalAmount > 0 && (
                <div className='amounts-circle'>{totalAmount}</div>
              )}
            </div>
            {this.state.smallCartOpen ? (
              <SmallCart
                navigate={this.props.navigate}
                closeCart={this.closeCart}
              />
            ) : null}
          </div>
        </div>
        <Outlet />
      </Wrapper>
    )
  }
}

export default hooksHOC(Navbar)

const Wrapper = styled.header`
  width: 1440px;
  height: 80px;
  position: relative;

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

  .activeMenu {
    font-weight: 600;
    color: #5ece7b;
    border-bottom: 2px solid #5ece7b;
  }

  .logo {
    position: absolute;
    left: 699px;
    top: calc(50% - 41px / 2 + 4.5px);
    cursor: pointer;
  }

  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 22px;
    position: absolute;
    right: 101px;
    top: 23px;
  }

  .currency-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .currency {
    font-family: 'Raleway';
    font-weight: 500;
    font-size: 18px;
    line-height: 29px;
  }

  .arrow {
    width: 6px;
    height: 3px;
  }

  .chooseCurrencyContainer {
    display: none;
    width: 114px;
    background: #fff;
    filter: drop-shadow(0px 4px 35px rgba(168, 172, 176, 0.19));
    position: absolute;
    top: 42px;
    right: -23px;
    padding: 17px 0;
  }

  .show {
    display: initial;
  }

  .currencyOption {
    font-family: 'Raleway';
    font-weight: 500;
    width: 114px;
    height: 45px;
    font-size: 18px;
    line-height: 45px;
    text-align: center;
    cursor: pointer;

    :hover {
      background: #eee;
    }
  }

  .activeCurrency {
    background: #eee;
  }

  .cart-icon-container {
    position: relative;
  }

  .amounts-circle {
    position: absolute;
    top: -9px;
    left: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
  }
`
