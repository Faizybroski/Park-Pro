"use client";

import PageHero from "@/components/shared/PageHero";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <PageHero
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
      />

      <section className="py-16 max-w-4xl mx-auto px-4 space-y-10">
        {/* Section */}
        <div
          className="rounded-2xl border p-6"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-xl font-bold mb-4">1. Bookings & Service</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • All bookings can be made through online booking or via telephone
              or email. Online booking should be made at least 24 hours before
              your date of departure. If the time is less than 24 hours before
              the flight, then the booking can be made via telephone.{" "}
            </li>
            <li>
              • We make every effort to ensure that collection and deliveries of
              vehicles are made at the requested time. However we do not accept
              the responsibility for delay of its services caused as a result of
              circumstances beyond our control such as traffic, congestion,
              delayed flights and security alerts. In certain busy periods it
              could take up to two hours to return your vehicle.
            </li>
            <li>
              • ParkPro Parking Ltd. reserves the right to refuse any booking
              made through the website or from our consolidators if the payment
              is declined( either by the customer or the consolidator) or due to
              any other issues.
            </li>
            <li>
              • We reserve the right to cancel a booking at any point in case of
              circumstances that are beyond our control or due to any other
              issue.{" "}
            </li>
            <li>
              • Due to the pandemic and local lockdown rules the normal service
              might be suspended depending on the guidelines and customers will
              need to pick and drop their vehicles from our parking
              facility.{" "}
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">2. Payments</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Increased duration of the stay after the booking period ends is
              charged at £20 per day and should be paid prior to the return of
              the vehicle. In case of non-payment we reserve the right to hold
              the vehicle and if the dues are not cleared we reserve the right
              to auction the vehicle after 6 months.{" "}
            </li>
            <li>
              • Full payments of booked service is due prior to the commencement
              of the service.{" "}
            </li>
            <li>
              • Charge of £20 will incur if vehicle needs to be returned after
              midnight.{" "}
            </li>
            <li>
              • Please note we are not liable for HEATHROW drop off or short
              stay car park charges. If the car is delivered in drop off or in
              the car park it remains the customers responsibility to pay for
              their car to be delivered. If customers receive any fines as a
              failure to pay their charges the customer will be responsible for
              any fines or penalties.{" "}
            </li>
            <li>
              • We reserve the right to charge a fee of £20 if your flight is
              early delayed over 2 hours to cover our extra costs.{" "}
            </li>
            <li>
              • ParkPro Parking Ltd. is responsible for the website payment
              transaction.
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">
            3. Amendments & Cancellations
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • A booking may be cancelled up to 72 hours prior to the date for
              which the service has been booked, and a full refund less £20
              administration cost will be made.
            </li>
            <li>
              • No refunds will be given for any cancellation or non use of our
              service made within 72 hours of the day of travel.{" "}
            </li>
            <li>
              • Any customer wishing to shorten length of stay for a service
              once that service has commenced will be liable to pay the fee for
              the whole service booked. An early arrival fee of £50 will be
              applied to cover our costs.
            </li>
            <li>
              • Any alterations made within 72 hours of departure and during the
              duration of stay will incur a charge of £20 for each and every
              amendment made. All amendments must be made via the phone
              +447903835808. Bookings can also be amended via Whatsapp. eMail
              amendments will not be accepted. All charges must be paid in
              advance to confirm the amendment.
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">4. Liability</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Our insurance covers our legal liabilities. </li>
            <li>
              • Vehicles and contents are left at the owners risk whilst the
              vehicle is parked. Our insurance only covers whilst moving your
              car from the airport to our compound or for any other purpose.
              Whilst your vehicle is parked with us you must rely on your own
              vehicle insurance policy.
            </li>
            <li>
              • Claims for damage will not be considered unless reported to
              ourstaff immediately on the return of the vehicle at the terminal
              and written confirmation is obtained to confirm damage. You should
              take pictures of your vehicle and mileage before dropping it off,
              we recommend taking 20 pictures to cover all sides and angles . No
              claims will be accepted if pictures are not taken priorso it is
              essential customers take their own images irrespective of our
              drivers actions. Complaint form must be completed in full for the
              complaint to be registered. No complaint will be considered once
              the driver has handed over the keys and left you with your key.
              Please check your vehicle thoroughly before accepting your keys.
            </li>
            <li>
              • We accept no liability for mechanical, structural and electrical
              failure of any part of your vehicle including windscreens, glass,
              tyres and alloys however caused. Please note any dash cam
              installed will be unplugged upon collection of the vehicle due to
              security reasons.
            </li>
            <li>
              • We accept no liability for any loss or damage whatsoever caused
              unless proved to be caused by the negligence of our employees.
            </li>
            <li>
              • Your vehicle must be taxed and comply with the road traffic act
              1988. This is deemed by us to case for the whole duration while
              the vehicle is in our possession. Any liabilities incurred by our
              company as a result of the client's vehicle not complying with the
              Road Traffic Act, the customer will be held responsible for all
              costs/liabilities incurred by the company.
            </li>
            <li>
              • We accept no liability for any faulty keys, alarm fobs, house or
              other keys left on the key ring. In the event of vehicles not
              starting, we reserve the right to charge for our time. Only the
              keys should be given to us.
            </li>
            <li>
              • In the event that the car acquires a puncture (including slow
              punctures) we reserve the right to charge either to inflate the
              tyre or for changing the tyre.{" "}
            </li>
            <li>
              • In the event that the vehicles do not start due to a flat
              battery, we reserve to charge for our time in attempting to start
              the vehicle. We will not be held responsible for any consequences
              that may result as a direct result of us having to jump start your
              vehicle.{" "}
            </li>
            <li>
              • In the event we have to pick you up from the terminal building,
              due to mechanical failure of your vehicle, we reserve the right to
              charge for this and any associated costs that may incur.
            </li>
            <li>
              • We require the customer to have the spare key for their vehicle,
              which is required to be taken with the customer. In case the spare
              key is required at any time, customers must carry the spare key
              with them.
            </li>
            <li>
              • During certain busy periods or lengthy periods of stay, your car
              may be parked in one of our larger compounds which could be up to
              50 miles (one way), depending which terminal you have dropped your
              vehicle off and they might not be equipped with CCTV cameras and
              during certain periods we might park the vehicle in a public
              facility.{" "}
            </li>
            <li>
              • In the event that your vehicle needs to be repaired, it must be
              carried out by our own approved organisation. It will be your
              responsibility to deliver and collect the car from there at no
              cost to ourselves. We will not agree or authorise any works to be
              carried out by dealerships even in the event vehicle forgoing its
              warranty.{" "}
            </li>
            <li>
              • On certain occasions some of the bookings are fulfilled by
              oursister companies.
            </li>
            <li>
              • In the event of a lost car key we reserve the right to use our
              own locksmith.
            </li>
            <li>
              • If the customer is travelling without theirspare key the
              customer would be responsible for providing us with the spare key.
            </li>
            <li>
              • If the customer does not have a spare key we will deliver the
              car to their desired address and the customer will have to pay the
              costs to have their car delivered by the recovery company.
            </li>
            <li>
              • In event of any damages claims all repairs are to be carried out
              by our approved garages only.
            </li>
            <li>
              • Any damages claims made the customer must pay an excess fee of
              up to the first £750 for the repairs.{" "}
            </li>
            <li>
              • In the event that we agree to carry out any repairs they must be
              carried out only by our approved garage. The delivery and
              collection of the car at that establishment will be the customer's
              responsibility. We reserve the right to restore the vehicle to the
              condition it was brought to us or hand over to us for parking. We
              shall not provide a courtesy car and nor shall we reimburse the
              cost if you hire a car.{" "}
            </li>
            <li>
              • Your vehicle will not be checked for damage, unless requested it
              is deemed that you agree to a waiver that your vehicle condition
              has not been inspected and ParkPro Parking Ltd. cannot be held
              responsible for any claims made whatsoever. If you ask and pay a
              £20 charge, we will inspect the paintwork and bodywork and record
              any damage before we park the vehicle (the vehicle inspection
              report).{" "}
            </li>
            <li>
              • To make any claims a complaint form must be completed in full
              with pictures of the vehicle when it was dropped off and when you
              picked up the vehicle both taken in the heathrow airport car park.
              These images must be provided with written conformation from the
              driver acknowledging the damage upon collection. Complaints will
              only be considered once this form has been completed in full.{" "}
            </li>
            <li>
              • If the customers vehicle tyres are not road worthy and any of
              our drivers are stopped because of it. Customer will be held
              responsible for the tyre conditions including any points and
              penalties. Customer will also have to have the vehicle released
              from the police compound. We will not accept any
              responsibility.{" "}
            </li>
            <li>
              • We endeavour to deliver your vehicle back to you within 30 mins
              of your call. This may be longer depending on traffic, weather
              conditions or any other uncontrollable factors.{" "}
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">5. Exclusions</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            We will not accept legal responsibility for the following:
            <li>• Loss and damage covered by your own insurance.</li>
            <li>
              • Any indirect loss as a result of damage or loss of the vehicle
              (such as loss of earnings).{" "}
            </li>
            <li>
              • We are not responsible for Natural damage while driver drive
              customer car and when car park in compound.
            </li>
            <li>
              • We are not responsible for any interior condition of the
              carsince it's not checked at any time. Please note any dash cams
              connected will be unplugged due to security and privacy reasons.
            </li>
            <li>
              • We will not be held liable for any delayed or missed flights as
              a direct or indirect result of our service. If we can not provide
              the service due to any reason we will only refund the parking fee
              paid to us.
            </li>
            <li>
              • We will not be responsible for any minor scratches or dents
              (whether marked on this document or not) which may not be possible
              to identify in confined times and weather conditions.
            </li>
            <li>
              • We will not be responsible for any chips or broken glassto the
              vehicle whether mentioned on this document or not.
            </li>
            <li>
              • We will not be responsible for any valuables left in the vehicle
              while in our custody eg. cash, electronics or any personal
              belongings.
            </li>
            <li>
              • We will not be responsible for any discolour of paintwork or
              dents orscratches that may become visible after a car wash.This is
              regardless if the dents and scratches are mentioned in this
              document or not.{" "}
            </li>
            <li>
              • We will not be responsible for any damage to any alloys or tyres
              regardless of if any damage is mentioned on this document.
            </li>
            <li>
              • In the event that we agree to any form of repair or compensation
              (whether liability is admitted or not by us) you (the client) will
              be responsible for the excess of any claim being £750 for any
              claim. This will be payable before any repairs can begin.{" "}
            </li>
            <li>
              • We shall not be liable to cover any
              vehiclesfortheft/fire/vandalism/criminal damage or any damage
              caused by the act of God or Nature while in our custody.
            </li>
            <li>
              • We will not be responsible for any claims of any nature below
              £750.00 including dents, bumps and scratches. Customers are liable
              for the first £750.00 on any damage claim as an excess fee.
            </li>
            <li>
              • We endeavour to deliver your vehicle back to you within 30 mins
              of your call. This may be longer depending on traffic, weather
              conditions or any other uncontrollable factors.
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">6. Changing the conditions</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • These conditions will remain in force unless the change has been
              in writing with our selves or with our written permission.
              Customer Relations Procedure{" "}
            </li>
            <li>
              • If there are any concerns or issues you wish to raise to
              investigate further, the following procedure needs to take effect.
            </li>
            <li>
              • A written correspondence needs to be made via e-mail ( all
              correspondence details are available on the customer copy coupon
              receipt.
            </li>
            <li>
              • A member of our customer relationsteam shall endeavour to
              respond back to your query within a maximum of 14 working
              days.{" "}
            </li>
            <li>
              • Please note that all matters shall be dealt with in writing. Any
              incidents/issues raised whilst picking or dropping your vehicle
              need to be made apparent to our staff member of which would be
              reported/logged back to the duty manager. No acceptance of
              liability can be made until the matter is thoroughly investigated.
            </li>
          </ul>
        </div>

        {/* Section */}
        <div className="rounded-2xl border p-6 card-hover hover-border-pop">
          <h2 className="text-xl font-bold mb-4">Note:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground font-bold">
            Ultra Low Emission Zone (ULEZ) is expanding across all London boroughs 
including Heathrow Airport from 29 August 2023. If you drive anywhere within the 
ULEZ, including the Heathrow Airport from 29 August 2023, and your vehicle does not 
meet the emissions standards, you will have to pay a charge of £12.50. Please make 
sure to set up AUTO PAY when coming to the airport to avoid any penalty tickets. The 
operator will not be liable in case you receive a penalty for not paying the ULEZ charge. 
Your car may be moved between yards whilst parked with us. Therefore please ensure 
auto pay is set up as we will not be liable for any fines incurred. Disclaimer. This is a 
note to all customers using our services we run a discounted service which is only 
possible to deliver under these set terms and conditions. We make every effort to 
provide quality service however given the nature of this business accidents, damages, 
delays can occur and keys may sometimes be lost and in these unfortunate 
circumstances we will have to follow all the terms and conditions listed above.
          </ul>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground mt-10">
          These terms are based on ParkPro Parking Limited service agreement.
        </p>
      </section>
    </div>
  );
}
