import React from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_SINGLE_PRODUCT } from '../gql'
import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

function hooksHOC(Component) {
  return function WrappedComponent(props) {
    const params = useParams()
    const { loading, error, data } = useQuery(
      GET_SINGLE_PRODUCT(params.productID)
    )
    console.log(data)
    return (
      <Component
        {...props}
        fetchedData={{ loading, error, data }}
        params={params}
      />
    )
  }
}

class PDP extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainImg: '',
      Size: '',
      Color: '',
      Capacity: '',
      'With USB 3 ports': '',
      'Touch ID in keyboard': '',
      addedToCart: false,
    }
  }

  static contextType = GlobalContext

  componentDidMount() {
    const { data } = this.props.fetchedData
    const product = data?.product
    this.setState({
      mainImg: product?.gallery[0],
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchedData !== this.props.fetchedData) {
      const { data } = this.props.fetchedData
      const product = data?.product
      this.setState({
        mainImg: product?.gallery[0],
      })
    }
  }

  handleAddToCart = (product, cartProducts, setCartProducts) => {
    for (let i = 0; i < product.attributes.length; i++) {
      if (this.state[product.attributes[i].name] === '') {
        return false
      }
    }

    const newCartProduct = {
      product,
      id: Date.now(),
      productID: product.id,
      Size: this.state.Size,
      Color: this.state.Color,
      Capacity: this.state.Capacity,
      'With USB 3 ports': this.state['With USB 3 ports'],
      'Touch ID in keyboard': this.state['Touch ID in keyboard'],
      amount: 1,
    }

    if (
      cartProducts.length === 0 ||
      !cartProducts.find((i) => i.productID === product.id)
    ) {
      cartProducts.push(newCartProduct)
      setCartProducts(cartProducts)
      return true
    } else {
      let matchedProducts = cartProducts.filter(
        (i) => i.productID === product.id
      )
      outer: for (let i = 0; i < matchedProducts.length; i++) {
        for (let j = 0; j < product.attributes.length; j++) {
          if (
            matchedProducts[i][product.attributes[j].name] !==
            this.state[product.attributes[j].name]
          ) {
            continue outer
          }
        }
        cartProducts = cartProducts.map((item) => {
          if (item.id === matchedProducts[i].id) {
            item.amount += 1
            return item
          }
          return item
        })
        setCartProducts(cartProducts)
        return true
      }
      cartProducts.push(newCartProduct)
      setCartProducts(cartProducts)
      return true
    }
  }

  render() {
    const { loading, error, data } = this.props.fetchedData
    const { currency, cartProducts, setCartProducts } = this.context

    const product = data?.product

    if (loading) return null
    if (error) return null

    if (!data.product) {
      return (
        <Wrapper>
          <h2>{`There is no product with id of ${this.props.params.productID}`}</h2>
        </Wrapper>
      )
    }

    const price = product?.prices.find(
      (item) => item.currency.symbol === currency
    )?.amount

    const dirtyHTML = product.description
    const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
      USE_PROFILES: { html: true },
    })

    return (
      <Wrapper>
        <div className='img-gallery'>
          {product.gallery.map((item, index) => {
            return (
              <img
                key={index}
                src={item}
                alt={product.name}
                className={
                  item === this.state.mainImg ? 'img active-img' : 'img'
                }
                onClick={() => this.setState({ mainImg: item })}
              />
            )
          })}
        </div>
        <img
          src={this.state.mainImg}
          alt={product.name}
          className='mainImage'
        />
        <div className='info-section'>
          <p className='brand'>{product.brand}</p>
          <p className='name'>{product.name}</p>
          <div className='attributes'>
            {product.attributes.length > 0 &&
              product.attributes.map((i) => {
                return (
                  <div key={i.id} className='attribute-container'>
                    <p className='attribute-name'>{i.name}:</p>
                    <div
                      className={
                        i.type !== 'swatch'
                          ? 'attribute-values-container-text'
                          : 'attribute-values-container-text attribute-values-container-swatch'
                      }
                    >
                      {i.items.map((j) => {
                        if (i.type !== 'swatch') {
                          return (
                            <p
                              key={j.id}
                              className={
                                this.state[i.name] === j.value
                                  ? 'attribute-value-text attribute-value-text-active'
                                  : 'attribute-value-text'
                              }
                              onClick={() => {
                                this.setState({
                                  [i.name]: j.value,
                                })
                              }}
                            >
                              {j.value}
                            </p>
                          )
                        } else {
                          return (
                            <p
                              key={j.id}
                              className={
                                this.state[i.name] === j.value
                                  ? 'attribute-value-swatch attribute-value-swatch-active'
                                  : 'attribute-value-swatch'
                              }
                              style={{ background: `${j.value}` }}
                              onClick={() => {
                                this.setState({
                                  [i.name]: j.value,
                                })
                              }}
                            ></p>
                          )
                        }
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
          <p className='attribute-name'>Price:</p>
          <p className='price'>
            {currency}
            {price}
          </p>
          <button
            type='button'
            className={product.inStock ? 'addtocard' : 'addtocard btn-disabled'}
            disabled={!product.inStock}
            onClick={() => {
              let addedToCart = this.handleAddToCart(
                product,
                cartProducts,
                setCartProducts
              )
              this.setState({ addedToCart })
              setTimeout(() => {
                this.setState({ addedToCart: false })
              }, 1000)
            }}
          >
            {this.state.addedToCart ? 'ADDED' : 'ADD TO CART'}
          </button>
          <div className='description'>{parse(cleanHTML)}</div>
        </div>
      </Wrapper>
    )
  }
}

export default hooksHOC(PDP)

const Wrapper = styled.div`
  position: absolute;
  top: 160px;
  left: 100px;

  .img-gallery {
    display: flex;
    max-height: 511px;
    overflow: auto;
    flex-direction: column;
    position: absolute;
    row-gap: 40px;
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

  .img {
    width: 79px;
    height: 80px;
    object-fit: cover;
    cursor: pointer;
  }

  .active-img {
    border: 2px solid #5ece7b;
  }

  .mainImage {
    width: 610px;
    height: 511px;
    object-fit: contain;
    position: absolute;
    left: 119px;
  }

  .info-section {
    position: absolute;
    left: 829px;
    width: 292px;
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 16px;
  }

  .brand {
    font-family: 'Raleway';
    font-weight: 600;
    font-size: 30px;
    line-height: 27px;
  }

  .name {
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 30px;
    line-height: 27px;
  }

  .attributes {
    display: grid;
    grid-auto-flow: row;
    /* grid-auto-rows: 100px; */
    grid-row-gap: 24px;
    margin-top: 27px;
    margin-bottom: 22px;
  }

  .attribute-container {
    display: grid;
    grid-auto-flow: row;
    grid-row-gap: 8px;
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
    cursor: pointer;
  }

  .attribute-value-text-active {
    background: #000;
    color: #fff;
  }

  .attribute-value-swatch {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  .attribute-value-swatch-active {
    outline: 1px solid #5ece7b;
    outline-offset: 2px;
  }

  .price {
    width: 86px;
    height: 46px;
    font-family: 'Raleway';
    font-weight: 700;
    font-size: 24px;
    line-height: 18px;
    color: #1d1f22;
    margin-top: -6px;
    display: flex;
    align-items: center;
  }

  .addtocard {
    width: 292px;
    height: 52px;
    border: none;
    background: #5ece7b;
    color: #fff;
    font-family: 'Raleway';
    font-weight: 600;
    font-size: 16px;
    line-height: 120%;
    cursor: pointer;
    margin-top: 4px;
  }

  .btn-disabled {
    background: grey;
  }

  .description {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 16px;
    line-height: 159.96%;
    color: #1d1f22;
    h1 {
      margin: 1rem 0;
      font-size: 1.2rem;
    }
    h3 {
      margin: 1rem 0;
    }
  }
`
