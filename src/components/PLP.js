import React, { useContext } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../context/global_context'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_PRODUCTS_BY_CATEGORY } from '../gql'

import { circleIcon } from '../static'

function hooksHOC(Component) {
  return function WrappedComponent(props) {
    const { category } = useContext(GlobalContext)
    const { loading, error, data } = useQuery(
      GET_PRODUCTS_BY_CATEGORY(category)
    )
    const navigate = useNavigate()
    const params = useParams()
    return (
      <Component
        {...props}
        fetchedData={{ loading, error, data }}
        navigate={navigate}
        params={params}
      />
    )
  }
}

class PLP extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addedToCart: false,
    }
  }

  static contextType = GlobalContext

  componentDidMount() {
    const categoryParams = this.props.params.category
    const { category, setCategory } = this.context
    if (category === '') {
      setCategory(categoryParams)
    }
  }

  handleAddToCart = (product, cartProducts, setCartProducts) => {
    const newCartProduct = {
      product,
      id: Date.now(),
      productID: product.id,
      Size: '',
      Color: '',
      Capacity: '',
      'With USB 3 ports': '',
      'Touch ID in keyboard': '',
      amount: 1,
    }

    product.attributes.map((i) => {
      newCartProduct[i.name] = i.items[0].value
      return i
    })

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
            newCartProduct[product.attributes[j].name]
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
    const { category, currency, cartProducts, setCartProducts } = this.context

    if (loading) return null
    if (error) return null
    return (
      <Wrapper>
        <p className='category'>{category}</p>
        <div className='products-container'>
          {data.category?.products?.map((item) => {
            return (
              <div
                key={item.id}
                className='single-product-container'
                onClick={() => {
                  this.props.navigate(`/product/${item.id}`)
                }}
              >
                <img
                  src={item.gallery[0]}
                  alt={item.name}
                  className='product-img'
                />
                {!item.inStock && <p className='outOfStock'>OUT OF STOCK</p>}
                {item.inStock && (
                  <img
                    src={circleIcon}
                    alt='Circle Icon'
                    className={
                      this.state.addedToCart
                        ? 'circleIcon circleIcon-clicked'
                        : 'circleIcon'
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      let addedToCart = this.handleAddToCart(
                        item,
                        cartProducts,
                        setCartProducts
                      )
                      this.setState({ addedToCart })
                      setTimeout(() => {
                        this.setState({ addedToCart: false })
                      }, 500)
                    }}
                  />
                )}
                <div
                  className={
                    item.inStock ? 'content' : 'content content-out-of-stock'
                  }
                >
                  <p className='title'>
                    {item.brand} {item.name}
                  </p>
                  <p className='price'>{`${currency}${
                    item.prices.find((i) => i.currency.symbol === currency)
                      .amount
                  }`}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Wrapper>
    )
  }
}

export default hooksHOC(PLP)

const Wrapper = styled.div`
  .category {
    position: absolute;
    left: 101px;
    top: 160px;
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 42px;
    text-transform: capitalize;
  }

  .products-container {
    position: absolute;
    left: 100px;
    top: 331px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 40px;
    grid-row-gap: 103px;
    padding-bottom: 5rem;
  }

  .single-product-container {
    width: 386px;
    height: 444px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    position: relative;
  }

  .single-product-container:hover {
    box-shadow: 0px 4px 35px rgba(168, 172, 176, 0.19);
    .circleIcon {
      display: initial;
    }
  }

  .product-img {
    width: 354px;
    height: 330px;
    object-fit: cover;
  }

  .outOfStock {
    position: absolute;
    left: 90px;
    top: 151px;
    font-family: 'Raleway';
    font-weight: 400;
    font-size: 24px;
    line-height: 160%;
    color: #8d8f9a;
  }

  .circleIcon {
    display: none;
    position: absolute;
    right: 31px;
    bottom: 72px;
    filter: drop-shadow(0px 4px 11px rgba(29, 31, 34, 0.1));
    cursor: pointer;
  }

  .circleIcon-clicked {
    filter: drop-shadow(0px 4px 11px green);
  }

  .content {
    width: 354px;
    height: 58px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 370px;
  }

  .content-out-of-stock {
    color: #8d8f9a;
  }

  .title {
    width: 354px;
    height: 29px;
    font-family: 'Raleway';
    font-weight: 300;
    font-size: 18px;
    display: flex;
    align-items: center;
  }

  .price {
    width: 100px;
    height: 29px;
    display: flex;
    align-items: center;
    font-family: 'Raleway';
    font-weight: 500;
  }
`
