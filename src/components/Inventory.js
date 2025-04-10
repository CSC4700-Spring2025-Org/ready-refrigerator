import React from 'react';

import { Box, Stack, Typography, Button, Modal, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react'
import { firestore } from '../firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore'


const CustomButton = styled(Button)(({ theme }) => ({
    borderColor: '#275289',
    fontFamily: 'Poppins',
    color: '#275289',
    '&:hover': {
      borderColor: '#275289',
      backgroundColor: 'E0E9FF',
    },
  }));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
};

export default function Home() {
    const [pantry, setPantry] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openRemove, setOpenRemove] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState(1)
    const [editItemName, setEditItemName] = useState('')
    const [editItemQuantity, setEditItemQuantity] = useState(1)
    const [itemToEdit, setItemToEdit] = useState(null)
    const [itemToRemove, setItemToRemove] = useState(null)
    const [recipes, setRecipes] = useState([]);
    const [showRecipes, setShowRecipes] = useState(false);
  
  
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleOpenEdit = (item) => {
      setItemToEdit(item)
      setEditItemName(item.name)
      setEditItemQuantity(item.count)
      setOpenEdit(true)
    }
    const handleCloseEdit = () => setOpenEdit(false)
    const handleOpenRemove = (item) => {
      setItemToRemove(item)
      setOpenRemove(true)
    }
    const handleCloseRemove = () => setOpenRemove(false)
  
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'pantry'))
      const docs = await getDocs(snapshot)
      const pantryList = []
      docs.forEach((doc) => {
        pantryList.push({ "name": doc.id, ...doc.data() })
      })
      console.log(pantryList)
      setPantry(pantryList)
    }
  
    useEffect(() => {
      updatePantry()
    }, [])
  
    const addItem = async (item, quantity) => {
      if (quantity < 0) quantity = 0; // Ensure quantity is not negative
      const itemLower = item.toLowerCase()
      const docRef = doc(collection(firestore, 'pantry'), itemLower)
      // Check if item exists
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { count } = docSnap.data()
        await setDoc(docRef, { count: count + quantity })
      } else {
        await setDoc(docRef, { count: quantity })
      }
      await updatePantry()
    }
  
    const editItem = async (item, newName, newQuantity) => {
      if (newQuantity < 0) newQuantity = 0; // Ensure quantity is not negative
      const itemRef = doc(collection(firestore, 'pantry'), item.name.toLowerCase())
      const newItemRef = doc(collection(firestore, 'pantry'), newName.toLowerCase())
  
      if (item.name.toLowerCase() !== newName.toLowerCase()) {
        const newItemSnap = await getDoc(newItemRef)
        if (newItemSnap.exists()) {
          const { count } = newItemSnap.data()
          await setDoc(newItemRef, { count: count + newQuantity })
        } else {
          await setDoc(newItemRef, { count: newQuantity })
        }
        await deleteDoc(itemRef)
      } else {
        await setDoc(newItemRef, { count: newQuantity })
      }
      await updatePantry()
    }
  
    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'pantry'), item.toLowerCase())
      await deleteDoc(docRef)
      await updatePantry()
      handleCloseRemove()
    }
  
    const filteredPantry = pantry.filter(({ name }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  
    return (
      <>
        <Box
          width="100vw"
          height="100vh"
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
        >
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily= 'Poppins'>
                Add Item
              </Typography>
              <Stack width="100%" direction={'column'} spacing={2}>
                <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
                <TextField
                  id="outlined-basic"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={itemQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setItemQuantity(value < 0 ? 0 : value);
                  }}
                />
                <CustomButton
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName, itemQuantity);
                    setItemName('');
                    setItemQuantity(1);
                    handleClose();
                  }}
                >
                  Add
                </CustomButton>
              </Stack>
            </Box>
          </Modal>
          <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily= 'Poppins'>
                Edit Item
              </Typography>
              <Stack width="100%" direction={'column'} spacing={2}>
                <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={editItemName} onChange={(e) => setEditItemName(e.target.value)} />
                <TextField
                  id="outlined-basic"
                  label="Quantity"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={editItemQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setEditItemQuantity(value < 0 ? 0 : value);
                  }}
                />
                <CustomButton
                  variant="outlined"
                  onClick={() => {
                    editItem(itemToEdit, editItemName, editItemQuantity);
                    setEditItemName('');
                    setEditItemQuantity(1);
                    handleCloseEdit();
                  }}
                >
                  Save
                </CustomButton>
              </Stack>
            </Box>
          </Modal>
          <Modal open={openRemove} onClose={handleCloseRemove} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily= 'Poppins'>
                Confirm Remove
              </Typography>
              <Typography id="modal-modal-description" fontFamily= 'Poppins' fontSize='15px'>Are you sure you want to remove this item?</Typography>
              <Stack width="100%" direction={'row'} spacing={2} justifyContent={'flex-end'}>
              <CustomButton variant="outlined" onClick={() => removeItem(itemToRemove.name)}>
                Yes
              </CustomButton>
              <CustomButton variant="outlined" onClick={handleCloseRemove}>
                No
              </CustomButton>
              </Stack>
            </Box>
          </Modal>
          <Box width="1310px" height="50px" display={'flex'} justifyContent={'flex-start'} alignItems={'center'} paddingTop={6} paddingBottom={5}>
            <Typography variant={'h4'} color={'#000000'} textAlign={'left'} fontFamily={'Poppins'}>
            <span style={{ fontWeight: 'bold' }}>Name's</span> Refrigerator and Inventory
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} gap={1} width="1310px" mb={3}>
            <Box width="83%" display={'flex'} alignItems={'center'} bgcolor={'#fff'} borderRadius={'50px'} boxShadow={'0px 8px 10px rgba(0, 0, 0, 0.3)'}>
              <TextField
                id="search-bar"
                placeholder="Search items in inventory..."
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '50px',
                    fontFamily: 'Poppins',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                  }
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                borderRadius: '50px',
                backgroundColor: 'transparent',
                border: '2px solid black',
                padding: '14px 35px',
                boxShadow: '0px 8px 10px rgba(0, 0, 0, 0.3)',
                textTransform: 'none', 
                fontSize: '12px',
                fontFamily: 'Poppins',
                color: 'black',
                '&:hover': {backgroundColor: 'transparent'}
              }}
            >
              Add Item
            </Button>
          </Box>
          <Box borderRadius={'15px'} boxShadow={'0px 4px 6px rgba(0, 0, 0, 0.1)'} width="1310px" height="500px" bgcolor={'#fff'} overflow={'hidden'} py={2} px={3}>
          <Box display={'flex'} paddingBottom={1} position="sticky" top={0} bgcolor={'#fff'} zIndex={1}>
              <Typography fontWeight={'bold'} fontFamily='Poppins' px={5}>Name</Typography>
              <Typography fontWeight={'bold'} fontFamily= 'Poppins' px={27}>Quantity</Typography>
            </Box>
            <Stack spacing={1} overflow={'auto'} sx={{ height: '100%' }}>
              {filteredPantry.map((item) => (
                <Box key={item.name} width="100%" minHeight="50px" display={'flex'} justifyContent={'space-between'} alignItems={'center'} bgcolor={'#f0f0f0'} paddingX={5} borderRadius={'10px'} boxShadow={'0px 2px 4px rgba(0, 0, 0, 0.1)'}>
                  <Typography variant={'h7'} color={'#333'} textAlign={'left'} width="20%">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </Typography>
  
                  <Typography variant={'h7'} color={'#333'} textAlign={'center'} width="120%">
                    {item.count}
                  </Typography>
  
                  <Box display={'flex'} justifyContent={'space-between'} width="100%">
                    <Button variant="contained" onClick={() => handleOpenEdit(item)} sx={{ borderRadius: '10px', backgroundColor: 'transparent', padding: '3px 30px', border: '2px solid #FF939B', color: '#FF939B', boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.0)', textTransform: 'none', fontSize: '16px', fontFamily: 'Poppins', '&:hover': {backgroundColor: 'white', boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.0)'}}}>
                      Edit
                    </Button>
                    <Button variant="contained" onClick={() => handleOpenRemove(item)} sx={{ borderRadius: '10px', backgroundColor: '#ff758c', padding: '3px 25px', border: '2px solid white', boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.0)', textTransform: 'none', fontSize: '16px', fontFamily: 'Poppins', '&:hover': {backgroundColor: '#FFA1A8', boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.0)'} }}>
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

      </>
    );
  }