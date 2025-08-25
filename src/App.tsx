import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import { Address as AddressType, Details } from "./types";
import { useFormState } from "@/hooks/useFormState";
import transformAddress from "./core/models/address";
import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

function App() {

  const [isLoading, setIsLoading] = React.useState(false);
  const { fieldValues, handleChange, clearForm } = useFormState({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddresses([]);
    handleChange("firstName")();
    handleChange("lastName")();
    handleChange("selectedAddress")();
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getAddresses?postcode=${fieldValues.postCode}&streetnumber=${fieldValues.houseNumber}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errormessage || "Failed to fetch addresses");
      }

      if (!data.details || !Array.isArray(data.details) || data.details.length === 0) {
        setAddresses([]);
        setError("No addresses found for the provided details");
        return;
      }
      const { details } = data;
      const transformedAddresses: AddressType[] = details.map((detail: Details) => {
        const rawAddress = {
          ...detail,
          firstName: fieldValues.firstName,
          lastName: fieldValues.lastName,
          lon: detail.long.toString(),
          lat: detail.lat.toString(),
          id: '',
        }
        return transformAddress(rawAddress)
      });
      setAddresses(transformedAddresses);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fieldValues.firstName === "" || fieldValues.lastName === "") {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!fieldValues.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === fieldValues.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: fieldValues.firstName,
      lastName: fieldValues.lastName,
    });
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={isLoading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                onChange: handleChange("postCode"),
                value: fieldValues.postCode,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                onChange: handleChange("houseNumber"),
                value: fieldValues.houseNumber,
              },
            },
          ]}
          onFormSubmit={(event) => 
            handleAddressSubmit(event)
          }
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange("selectedAddress")}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {fieldValues.selectedAddress && (
          <Form 
            label="✏️ Add personal info to address"
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  onChange: handleChange("firstName"),
                  value: fieldValues.firstName,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  onChange: handleChange("lastName"),
                  value: fieldValues.lastName,
                },
              },
            ]}
            loading={false}
            onFormSubmit={(event) => 
              handlePersonSubmit(event)
            }
            submitText="Add to addressbook"
          />
        )}

        {error && <ErrorMessage error={error} />}

        <Button
          variant="secondary"
          onClick={() => {
            clearForm()
            setAddresses([])
            setError(undefined)
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
