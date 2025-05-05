/**
 * Represents a contact with a name and email address.
 */
export interface Contact {
  /**
   * The contact's name.
   */
  name: string;
  /**
   * The contact's email address.
   */
  email: string;
}

/**
 * Asynchronously subscribes a contact to a mailing list.
 *
 * @param contact The contact to subscribe.
 * @returns A promise that resolves to true if the subscription was successful, false otherwise.
 */
export async function subscribeContact(contact: Contact): Promise<boolean> {
  // TODO: Implement this by calling the Mailchimp API.

  return true;
}
