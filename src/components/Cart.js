import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'
import { ImgGallery } from '.'

class Cart extends React.Component {
  static contextType = GlobalContext

  render() {
    const { currency, cartProducts, setCartProducts } = this.context
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
        <h2 className='cart-heading'>Cart</h2>
        <div className='container'>
          <hr className='horizontal-line' />
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
                <hr className='horizontal-line' />
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
                  <ImgGallery images={product.gallery} />
                </div>
              </div>
            )
          })}
          <div className='result'>
            <p className='final'>Tax 21%:</p>
            <p className='final-value'>$42.00</p>
            <p className='final'>Quantity:</p>
            <p className='final-value'>{`${totalAmount}`}</p>
            <p className='final'>Total: </p>
            <p className='final-value'>{`${currency}${totalPrice}`}</p>
          </div>
          <button className='order'>ORDER</button>
        </div>
      </Wrapper>
    )
  }
}

export default Cart

const Wrapper = styled.main`
  position: absolute;
  top: 160px;
  left: 100px;
  z-index: -5;

  .cart-heading {
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    text-transform: uppercase;
    color: #1d1f22;
  }

  .container {
    position: absolute;
    top: 95px;
    padding-bottom: 10rem;
  }

  .horizontal-line {
    width: 1240px;
    height: 1px;
    border: none;
    background: #e5e5e5;
    grid-area: 5 / 1 / 6 / 3;
  }

  .single-product-container {
    width: 1240px;
    min-height: 330px;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 16px;
    margin-top: 24px;
    grid-template-columns: 1fr 1fr;
  }

  .brand {
    font-family: 'Raleway';
    font-weight: 600;
    font-size: 30px;
    line-height: 27px;
    grid-area: 1 / 1 / 2 / 2;
  }

  .name {
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 30px;
    line-height: 27px;
    grid-area: 2 / 1 / 3 / 2;
  }

  .price {
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    color: #1d1f22;
    margin-top: 4px;
    grid-area: 3 / 1 / 4 / 2;
  }

  .attributes {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 16px;
    margin-top: 4px;
    margin-bottom: 22px;
    grid-area: 4 / 1 / 5 / 2;
  }

  .attribute-container {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 7px;
  }

  .attribute-name {
    font-family: 'Roboto Condensed';
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    color: #1d1f22;
    text-transform: uppercase;
  }

  .attribute-values-container-text {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 63px;
    grid-column-gap: 12px;
  }

  .attribute-values-container-swatch {
    grid-auto-columns: 32px;
  }

  .attribute-value-text {
    width: 63px;
    height: 45px;
    border: 1px solid #1d1f22;
    display: grid;
    place-items: center;
  }

  .attribute-value-text-active {
    background: #000;
    color: #fff;
  }

  .attribute-value-swatch {
    width: 32px;
    height: 32px;
  }

  .attribute-value-swatch-active {
    outline: 1px solid #5ece7b;
    outline-offset: 2px;
  }

  .product-imgs-container {
    grid-area: 1 / 2 / 6 / 3;
    justify-self: end;
    display: grid;
    grid-template-columns: 45px 200px;
    grid-template-rows: 45px 198px 45px;
    grid-column-gap: 24px;
  }

  .change-amount {
    width: 45px;
    height: 45px;
    border: 1px solid #1d1f22;
    font-size: 2rem;
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

  .product-image {
    width: 200px;
    height: 288px;
    object-fit: contain;
    grid-area: 1 / 2 / 4 / 3;
  }

  .result {
    display: grid;
    grid-template-columns: 110px 200px;
    grid-row-gap: 8px;
    margin-top: 24px;
  }

  .final {
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 24px;
    line-height: 28px;
  }

  .final-value {
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
  }

  .order {
    width: 279px;
    height: 43px;
    background: #5ece7b;
    border: none;
    color: #fff;
    font-family: 'Raleway';
    font-weight: 600;
    font-size: 14px;
    line-height: 120%;
    margin-top: 16px;
    cursor: pointer;
  }
`
