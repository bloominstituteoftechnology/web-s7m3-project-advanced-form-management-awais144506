// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React,{useState,useEffect} from 'react'
import * as yup from "yup"
import axios from 'axios'
const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const initialFormValues = {
  username:"",
  favLanguage:"",
  favFood:"",
  agreement:false
}
const initialFormErrors = {
  username:"",
  favLanguage:"",
  favFood:"",
  agreement:""
}

const initialDisabled = true
// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const schema = yup.object().shape({
  username:yup
  .string()
  .trim()
  .required(e.usernameRequired)
  .min(3,e.usernameMin)
  .max(20,e.usernameMax),

  favLanguage:yup
  .string().required(e.favLanguageRequired).trim()
  .oneOf(["javascript","rust"],e.favLanguageOptions),

  favFood:yup
  .string().required(e.favFoodRequired).trim()
  .oneOf(["pizza","spaghetti","broccoli"],e.favFoodOptions),

  agreement:yup.boolean()
  .required(e.agreementRequired)
  .oneOf([true],e.agreementOptions)

})




export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [formValues,setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors) 
  const [serverSuccess,setServerSuccess] = useState()
  const [serverFaliure,setServerFailure] = useState()
  const [disabled, setDisabled] = useState(initialDisabled)  
  


  useEffect (()=>{
    schema.isValid(formValues).then(valid=>setDisabled(!valid))
  },[formValues])

  const onChange = evt => {
    const {name,value,checked,type} = evt.target
    const newValues = type ==="checkbox"?checked:value
    validate(name,newValues)
    setFormValues({
      ...formValues,
      [name]: newValues
    })
  }

  const onSubmit = evt => {

    evt.preventDefault()
    axios.post("https://webapis.bloomtechdev.com/registration",formValues)
    .then(res=>
     { setFormValues(initialFormValues)
      setServerSuccess(res.data.message)
      setServerFailure()
    }
    )
    .catch(err=>{
      setServerFailure(err.response.data.message)
      setServerSuccess()
    })
  }

  const validate = (name, value) => {
    yup.reach(schema,name)
    .validate(value)
    .then(()=>setFormErrors({...formErrors,[name]:""}))
    .catch(err=>setFormErrors({...formErrors,[name]:err.errors[0]}))
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
       {serverSuccess&& <h4 className="success">{serverSuccess}</h4>}
       {serverFaliure && <h4 className="error">{serverFaliure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={formValues.username} id="username" name="username" type="text" placeholder="Type Username" onChange={onChange}/>
          {formErrors.username&&<div className="validation">{formErrors.username}</div>
  }      </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} checked={formValues.favLanguage==="javascript"}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange} checked={formValues.favLanguage==="rust"}/>
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage&&<div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={formValues.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
         {formErrors.favFood&& <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange}  checked={formValues.agreement}/>
            Agree to our terms
          </label>
          {formErrors.agreement&&<div className="validation">{formErrors.agreement}</div>
 }       </div>

        <div>
          <input type="submit" disabled={disabled} />
        </div>
      </form>
    </div>
  )
}
