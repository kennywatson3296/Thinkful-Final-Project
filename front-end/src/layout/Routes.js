import React, {useState} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import {today} from "../utils/date-time"
import CreateReservation from "../reservations/CreateReservation"
import CreateTable from "../tables/CreateTable"
import FindReservation from "../reservations/FindReservation";
import EditReservation from "../reservations/EditReservation"
import SeatReservation from "../tables/SeatReservation";
/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today())
  console.log(date)
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/search">
        <FindReservation />
      </Route>
      <Route path="/reservations/:reservationId/edit">
        <EditReservation  setDate={setDate}/>
      </Route>
      <Route path="/reservations/:reservationId/seat">
        <SeatReservation setDate={setDate}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} setDate={setDate}/>
      </Route>
      <Route path = "/reservations/new">
        <CreateReservation setDate={setDate}/>
      </Route>
      <Route path = "/tables/new">
        <CreateTable setDate={setDate}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
