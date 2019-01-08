import React, { Component } from 'react';
import SearchBar from './search-bar';
import CharacterList from './character-list';
import Details from './details';
import md5 from 'md5';
import $ from 'jquery';

const API_URL = 'https://gateway.marvel.com:443/v1/public/';
const publicKey = '976693a5cb96aeb81b7df9c456249244';
const privateKey = 'b140e8685d9090d6a81fb9b4b4b3e6479ccc77df';
const ts = '1';
const auth = `ts=${ts}&apikey=${publicKey}&hash=${md5(`${ts}${privateKey}${publicKey}`)}`;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: null,
      selectedCharacter: null,
    };
    this.CharacterSearch = this.CharacterSearch.bind(this);
  }

  componentDidMount = () => {
    this.GetInitialChararcters();
  };

  GetInitialChararcters() {
    $.getJSON(`${API_URL}/characters?${auth}&limit=5`, result => {
      const characters = result.data.results;
      this.setState({ characters });
    });
  }

  CharacterSearch(term) {
    $.getJSON(`${API_URL}/characters?${auth}&limit=5&nameStartsWith=${term}`, result => {
      const characters = result.data.results;
      this.setState({ characters });
    });
  }

  handleCharacterSelect = character => {
    this.setState({ selectedCharacter: character });
  };

  render() {
    console.log('app.js stateten gelen characters', this.state.characters);
    if (!this.state.characters) return <h1>Loading...</h1>;
    if (this.state.characters.length === 0)
      return (
        <div className="container">
          <SearchBar onSearchButtonClick={this.CharacterSearch} />{' '}
          <h1> Aradığınız Karakter Bulunmamıştır Lütfen Başka Bir Karakter Araması Yapınız..</h1>
        </div>
      );
    return (
      <div className="container">
        <SearchBar onSearchButtonClick={this.CharacterSearch} />
        <CharacterList
          characters={this.state.characters}
          onCharacterSelect={this.handleCharacterSelect}
        />
        <Details character={this.state.selectedCharacter || this.state.characters[0]} />
      </div>
    );
  }
}
