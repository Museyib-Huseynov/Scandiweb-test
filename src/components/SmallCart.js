import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'

class SmallCart extends React.Component {
  static contextType = GlobalContext

  render() {
    const { currency, cartProducts, setCartProducts, setSmallCartOpen } =
      this.context
    const totalPrice = cartProducts
      .reduce((acc, item) => {
        const product = item.product
        const price = product.prices.find(
          (j) => j.currency.symbol === currency
        ).amount
        return acc + item.amount * price
      }, 0)
      .toFixed(2)

    const totalAmount = cartProducts.reduce((acc, item) => {
      return acc + item.amount
    }, 0)

    return (
      <Wrapper>
        <div className='heading'>
          My Bag,{' '}
          <span>
            {totalAmount} item{totalAmount > 1 ? 's' : ''}
          </span>
        </div>

        <div className='products-container'>
          {cartProducts.map((item) => {
            const product = item.product
            const price = product.prices.find(
              (j) => j.currency.symbol === currency
            ).amount
            if (item.amount < 1) {
              return null
            }

            return (
              <div key={item.id} className='single-product-container'>
                <p className='brand'>{product.brand}</p>
                <p className='name'>{product.name}</p>
                <p className='price'>
                  {currency}
                  {price}
                </p>

                <div className='attributes'>
                  {product.attributes.length > 0 &&
                    product.attributes.map((i) => {
                      return (
                        <div key={i.id} className='attribute-container'>
                          <p className='attribute-name'>{i.name}:</p>
                          <div
                            className={
                              i.type === 'text'
                                ? 'attribute-values-container-text'
                                : 'attribute-values-container-text attribute-values-container-swatch'
                            }
                          >
                            {i.items.map((j) => {
                              if (i.type === 'text') {
                                return (
                                  <p
                                    key={j.id}
                                    className={
                                      j.value === item[i.name]
                                        ? 'attribute-value-text attribute-value-text-active'
                                        : 'attribute-value-text'
                                    }
                                  >
                                    {j.value}
                                  </p>
                                )
                              } else {
                                return (
                                  <p
                                    key={j.id}
                                    className={
                                      j.value === item[i.name]
                                        ? 'attribute-value-swatch attribute-value-swatch-active'
                                        : 'attribute-value-swatch'
                                    }
                                    style={{ background: `${j.value}` }}
                                  ></p>
                                )
                              }
                            })}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <div className='product-imgs-container'>
                  <div
                    className='change-amount plus'
                    onClick={() => {
                      const newCartProducts = cartProducts.map((x) => {
                        if (x.id === item.id) {
                          x.amount += 1
                          return x
                        }
                        return x
                      })
                      setCartProducts(newCartProducts)
                    }}
                  >
                    +
                  </div>
                  <p className='amount'>{item.amount}</p>
                  <div
                    className='change-amount minus'
                    onClick={() => {
                      let newCartProducts = cartProducts.map((x) => {
                        if (x.id === item.id) {
                          x.amount -= 1
                          if (x.amount === 0) {
                            return null
                          }
                          return x
                        }
                        return x
                      })
                      newCartProducts = newCartProducts.filter(
                        (y) => y !== null
                      )
                      setCartProducts(newCartProducts)
                    }}
                  >
                    -
                  </div>
                  <img
                    src={product.gallery[0]}
                    alt='product img'
                    className='product-img'
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className='total-price'>
          <p className='total'>Total</p>
          <p className='total-p'>
            {currency}
            {totalPrice}
          </p>
        </div>

        <div className='buttons'>
          <button
            className='viewbag'
            onClick={() => {
              setSmallCartOpen()
              this.props.navigate('/cart')
            }}
          >
            VIEW BAG
          </button>
          <button className='checkout'>CHECK OUT</button>
        </div>
      </Wrapper>
    )
  }
}

export default SmallCart

const Wrapper = styled.div`
  width: 325px;
  padding: 32px 16px;
  background: #fff;
  position: absolute;
  top: 55px;
  right: -30px;
  z-index: 1000;

  .heading {
    width: 100%;
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 16px;
    line-height: 160%;
    margin-bottom: 32px;
    span {
      font-weight: 100;
    }
  }

  .products-container {
    max-height: 460px;
    overflow: auto;
    ::-webkit-scrollbar {
      width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey;
      border-radius: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: grey;
      border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: green;
    }
  }

  .single-product-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 8px;
    margin-bottom: 42px;
  }

  .brand {
    font-family: 'Raleway';
    font-weight: 300;
    font-size: 16px;
    grid-area: 1 / 1 / 2 / 2;
  }

  .name {
    font-family: 'Raleway';
    font-weight: 300;
    font-size: 16px;
    grid-area: 2 / 1 / 3 / 2;
  }

  .price {
    font-family: 'Raleway';
    font-weight: 500;
    font-size: 16px;
    color: #1d1f22;
    grid-area: 3 / 1 / 4 / 2;
  }

  .attributes {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
    grid-area: 4 / 1 / 5 / 2;
  }

  .attribute-container {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
  }

  .attribute-name {
    font-family: 'Roboto Condensed';
    font-weight: 400;
    font-size: 14px;
    color: #1d1f22;
  }

  .attribute-values-container-text {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 24px;
    grid-column-gap: 8px;
  }

  .attribute-values-container-swatch {
    grid-auto-columns: 20px;
  }

  .attribute-value-text {
    width: 24px;
    height: 24px;
    border: 1px solid #1d1f22;
    display: grid;
    place-items: center;
    font-size: 8px;
  }

  .attribute-value-text-active {
    background: #000;
    color: #fff;
  }

  .attribute-value-swatch {
    width: 20px;
    height: 20px;
  }

  .attribute-value-swatch-active {
    outline: 1px solid #5ece7b;
    outline-offset: 2px;
  }

  .product-imgs-container {
    grid-area: 1 / 2 / 6 / 3;
    justify-self: end;
    display: grid;
    grid-template-columns: 24px 121px;
    grid-template-rows: 24px 142px 24px;
    grid-column-gap: 8px;
  }

  .change-amount {
    width: 24px;
    height: 24px;
    border: 1px solid #1d1f22;
    font-size: 16px;
    font-weight: 100;
    display: grid;
    place-items: center;
    user-select: none;
    cursor: pointer;
  }

  .plus {
    grid-area: 1 / 1 / 2 / 2;
  }

  .minus {
    grid-area: 3 / 1 / 4 / 2;
  }

  .amount {
    grid-area: 2 / 1 / 3 / 2;
    place-self: center;
  }

  .product-img {
    width: 121px;
    height: 190px;
    object-fit: cover;
  }

  .total-price {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .total-p {
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 16px;
    line-height: 160%;
    justify-self: end;
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 32px;
  }

  .viewbag {
    width: 140px;
    height: 43px;
    border: 1px solid #000;
    cursor: pointer;
  }

  .checkout {
    width: 140px;
    height: 43px;
    border: none;
    background: #5ece7b;
    color: #fff;
  }
`
