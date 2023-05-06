import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card
} from 'react-bootstrap'
import Message from '../components/Message'
import {addToCart} from '../actions/cartActions'

const CartPage = ({match, location, history }) => {
  const productId = match.params.id
  // console.log(location.search) // ?qty=2
  const qty = location.search ? location.search.split('=')[1] : 1
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const {cartItems} = cart
  // console.log(cartItems)

  useEffect( () => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])
  return (
    <div>CartPage</div>
  )
}

export default CartPage