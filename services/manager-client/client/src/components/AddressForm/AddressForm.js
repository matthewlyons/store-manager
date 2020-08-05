import React, { useEffect } from 'react';

export default function AddressForm() {
  var autocomplete;

  const initAutocomplete = () => {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    console.log('Running');
    autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      { types: ['geocode'] }
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  };
  const fillInAddress = () => {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    console.log(place);

    let { address_components } = place;
    let streetAddress, number, street, city, state, zip;

    address_components.forEach((component) => {
      let type = component.types[0];
      let value = component.long_name;
      let shortvalue = component.short_name;
      if (type === 'street_number') {
        number = value;
      } else if (type === 'route') {
        street = shortvalue;
      } else if (type === 'locality') {
        city = value;
      } else if (type === 'administrative_area_level_1') {
        state = value;
      } else if (type === 'postal_code') {
        zip = value;
      }
    });
    streetAddress = `${number} ${street}`;
    console.log(`Street Address: ${streetAddress}`);
    console.log(`City: ${city}`);
    console.log(`State: ${state}`);
    console.log(`Zip code: ${zip}`);
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

  return (
    <div>
      <div id="locationField">
        <input
          id="autocomplete"
          placeholder="Enter your address"
          type="text"
          style={{ width: '95vw' }}
        />
      </div>
    </div>
  );
}
