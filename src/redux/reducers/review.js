import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const endpoint = `https://striveschool-api.herokuapp.com/api/comments/`
const key = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdlM2MxNmI5YzBmNzAwMTQ0ODRlZDgiLCJpYXQiOjE2ODc1NDI0MzEsImV4cCI6MTY4ODc1MjAzMX0.d6MQUWUpdusXGvNd72LzIvVPzs6OxCfRXI1iQkTjhy8"


//GET
export const fetchReview = createAsyncThunk(
  'review/fetchReview',
  async (asin) => {
    const response = await fetch(endpoint + asin, {
      headers: {
        Authorization: key
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }
);

//POST
export const postReview = createAsyncThunk(
  'review/postReview',
  async (review) => {
    try {
      console.log(review);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
          'Content-type': 'application/json',
          Authorization: key
        }
      });
      if (response.ok) {
        console.log('Review added');
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);


//DELATE
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async (id, { getState }) => {
    try {
      const state = getState();
      const comment = state.root.review.reviewArray.find((review) => review._id === id);
      
      const response = await fetch(endpoint + comment._id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: key,
        },
      });
      if (response.ok) {
        console.log('Review deleted');
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//PUT
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async (review) => {
    try {
      const response = await fetch(endpoint + review._id, {
        method: 'PUT',
        body: JSON.stringify(review),
        headers: {
          'Content-type': 'application/json',
          Authorization: key
        }
      });
      if (response.ok) {
        console.log('Review updated');
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);




const initialState = {
  reviewArray: [],
  StateAddButton: false,
  StateRating: 0,
  Loading: false,
  CurrentReview: {},
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReview: (state, action) => {
      state.reviewArray = action.payload;
    },
    setAddButton: (state, action) => {
      state.StateAddButton = action.payload;
    },
    setAddRate: (state, action) => {
      state.StateRating = action.payload;
    },
    setEditMode: (state, action) => {
      const { id, editMode } = action.payload;
      const index = state.reviewArray.findIndex((review) => review._id === id);
      if(state.reviewArray[index].editMode === editMode) {
        state.reviewArray[index].editMode = !editMode;
      } else{
        state.reviewArray[index].editMode = editMode;
      }
      state.CurrentReview = state.reviewArray[index];
      
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReview.pending, (state) => {
        state.Loading = true;
      })
      .addCase(fetchReview.fulfilled, (state, action) => {
        state.Loading = false;
        state.reviewArray = action.payload.reverse() || [];
        state.StateAddButton = true;
      })
      .addCase(fetchReview.rejected, (state, action) => {
        state.Loading = false;
        console.log(action.error);
      });
  }
});

export const {
  setReview,
  setModalOpen,
  setAddRate,
  setAddButton,
  setEditMode
} = reviewSlice.actions;

export default reviewSlice.reducer;


