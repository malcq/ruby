import { createGlobalStyle } from 'styled-components';
import QuillStyles from './QuillStyles';
import CalendarStyles from './CalendarStyles';
import SliderStyles from './SliderStyles';

export default createGlobalStyle`
  * {
    outline: none !important;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  html {
    height: 100%;
    font-family: 'Noto Sans', sans-serif;
    font-size: 16px;
    color: black;
  }

  body {
    min-height: 100%;
    position: relative;
    padding-bottom: 50px;
    display: flex;
    flex-direction: column;
  }

  #root {
    flex-grow: 1;
  }

  a {
    text-decoration: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .pageTitle {
    margin-top: 30px;
    margin-bottom: 30px;
    text-align: center;
  }

  .article-input {
    text-align: left;
  }

  textarea {
    min-width: 100%;
    max-width: 100%;
    min-height: 34px;
  }

  pre {
    color: black;
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    display: inline;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    white-space: pre-line;
  }

  .tab-content {
    padding: 10px;
  }

  .changeAvatar.well {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    margin: 0;
    padding: 10px;
    background: #f5f5f5ef;
    border: none;
    border-radius: 0;
  }

  .usersTable td {
    text-align: left;
  }

  .linkType {
    color: #337ab7;
    cursor: pointer;
    text-decoration: none;
  }

  .linkType:hover {
    color: #23527c;
    text-decoration: underline;
  }

  .select {
    background: rgba(226, 226, 226, 0.314);
  }

  .up::after {
    content: '';
    width: 2px;
    height: 15px;
    background-color: #717171;
    position: absolute;
    top: 21px;
    right: 19px;
  }
  .up::before {
    content: '';
    width: 10px;
    height: 10px;
    border-left: 2px solid #717171;
    border-top: 2px solid #717171;
    position: absolute;
    top: 21px;
    transform: rotate(45deg);
    right: 15px;
  }

  .down::after {
    content: '';
    width: 2px;
    height: 15px;
    background-color: #717171;
    position: absolute;
    top: 21px;
    right: 19px;
  }
  .down::before {
    content: '';
    width: 10px;
    height: 10px;
    border-left: 2px solid #717171;
    border-top: 2px solid #717171;
    position: absolute;
    top: 25px;
    transform: rotate(-135deg);
    right: 15px;
  }

  .dropdown ul,
  .nav {
    text-align: center;
  }

  .btn,
  a {
    transition: 0.2s;
  }

  .DayPicker .DayPicker-wrapper .DayPicker-NavButton--prev,
  .DayPicker .DayPicker-wrapper .DayPicker-NavButton--next {
    width: 2em;
    height: 2em;
    top: 0;
  }
  .previewlink {
    color: #333;
  }
  .previewlink:hover {
    text-decoration: none;
  }

  .previewlink-container {
    width: 100%;
    height: 250px;
    -webkit-box-shadow: 5px 5px 16px 0px rgba(0, 0, 0, 0.52);
    -moz-box-shadow: 5px 5px 16px 0px rgba(0, 0, 0, 0.52);
    box-shadow: 5px 5px 16px 0px rgba(0, 0, 0, 0.52);
    display: flex;
    flex-direction: row;
    border-radius: 5px;
    padding: 0 6px;
  }
  .previewlink-img {
    width: 40%;
    height: 100%;
    object-fit: cover;
  }
  .previewlink-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    justify-content: space-between;
  }
  .previewlink-title {
    margin: 0;
    font-family: Verdana, Geneva, sans-serif;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /* font-size: 18px; */
  }
  .previewlink-description {
    margin: 5px 0 0 0;
    font-family: Verdana, Geneva, sans-serif;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  .previewlink-url {
    margin: 0;
    text-transform: uppercase;
    font-family: 'Arial Black', Gadget, sans-serif;
    color: #333;
  }
  .article-delete {
    position: absolute;
  }

  ${QuillStyles}

  @media (max-width: 610px) {
    .DayPicker .DayPicker-wrapper .DayPicker-NavButton--prev,
    .DayPicker .DayPicker-wrapper .DayPicker-NavButton--next {
      width: 3em;
      height: 4em;
      top: -1em;
    }
    .DayPicker .DayPicker-wrapper .DayPicker-NavButton--prev {
      right: 2em;
    }
  }

  @media (max-width: 400px) {
    .previewlink-info {
      padding: 6px;
    }
    .previewlink-container {
      /* width: 100%; */
      height: 150px;
    }
    .previewlink-description {
      -webkit-line-clamp: 3;
    }
  }

  /* hover animation */
  .float-animation {
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: -webkit-transform;
    transition-property: transform;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  }

  .float-animation:hover {
    -webkit-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    transform: translateY(-10px);
  }

  .appbar-wrapper {
    flex-grow: 1;
  }

  .appbar-logo {
    flex-grow: 1;
  }

  .appbar-menubutton {
    margin-left: 12;
    margin-right: 20;
  }

  .login-button {
    pointer-events: none;
  }

  ${CalendarStyles}
  ${SliderStyles}
`;
