import graphene
from django.shortcuts import get_object_or_404
import pytz
import datetime

from django.utils import timezone

from .types import BookingType
from apps.cabins.models import Booking as BookingModel
from apps.cabins.models import Cabin as CabinModel
from .mail import send_admin_mail, calculate_booking_price, send_user_confirmation_mail


class CreateBooking(graphene.Mutation):
    class Arguments:
        firstname = graphene.String()
        surname = graphene.String()
        phone = graphene.Int()
        receiver_email = graphene.String()
        check_in = graphene.Date()
        check_out = graphene.Date()
        price = graphene.Int()
        cabins = graphene.List(graphene.Int)

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        self,
        info,
        firstname,
        surname,
        phone,
        receiver_email,
        check_in,
        check_out,
        price,
        cabins,

    ):
        booking = BookingModel.objects.create(
            firstname=firstname,
            surname=surname,
            phone=phone,
            receiver_email=receiver_email,
            check_in=check_in,
            check_out=check_out,
            price=price,
            timestamp=timezone.now()
        )
        booking.cabins.set(CabinModel.objects.filter(id__in=cabins))
        ok = True
        return CreateBooking(booking=booking, ok=ok)


# fiks: oppdaterer ikke bookingen...
class UpdateBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()
        contact_num = graphene.Int()
        contact_person = graphene.String()
        start_day = graphene.String()  # string "yyyy-mm-dd"
        end_day = graphene.String()

    ok = graphene.Boolean()
    booking = graphene.Field(BookingType)

    def mutate(
        root,
        info,
        booking_id,
        contact_num=None,
        contact_person=None,
        start_day=None,
        end_day=None,
    ):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.contact_num = (
            contact_num if contact_num is not None else booking.contact_num
        )
        booking.contact_person = (
            contact_person if contact_person is not None else booking.contact_person
        )
        booking.start_day = start_day if start_day is not None else booking.start_day
        booking.end_day = end_day if end_day is not None else booking.end_day

        ok = True

        return UpdateBooking(booking=booking, ok=ok)


class DeleteBooking(graphene.Mutation):
    class Arguments:
        booking_id = graphene.ID()

    ok = graphene.Boolean()

    def mutate(root, info, booking_id):
        booking = get_object_or_404(BookingModel, pk=booking_id)
        booking.delete()
        ok = True
        return DeleteBooking(ok=ok)


class SendEmail(graphene.Mutation):
    class Arguments:
        firstname = graphene.String()
        lastname = graphene.String()
        email = graphene.String()
        phone = graphene.String()
        number_indok = graphene.Int()
        number_external = graphene.Int()
        cabin_ids = graphene.List(graphene.String)
        check_in_date = graphene.String()
        check_out_date = graphene.String()
        range_length = graphene.Int()

    ok = graphene.Boolean()

    def mutate(self, info, firstname, lastname,
               email, phone, number_indok, number_external,
               cabin_ids, check_in_date, check_out_date, range_length):

        cabins = CabinModel.objects.all().filter(id__in=cabin_ids)
        chosen_cabins_names = [cabin.name for cabin in cabins]
        chosen_cabins_string = cabins[0].name if len(cabins) == 1 else ",".join(chosen_cabins_names[:-1]) + f" og {chosen_cabins_names[-1]}"
        price = calculate_booking_price(cabins=cabins, number_indok=number_indok, number_external=number_external) * range_length

        booking_info = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "phone": phone,
            "number_indok": number_indok,
            "number_external": number_external,
            "chosen_cabins_string": chosen_cabins_string,
            "price": price,
            "check_in_date": check_in_date,
            "check_out_date": check_out_date,
            "range_length": range_length
        }

        send_admin_mail(info, booking_info)
        send_user_confirmation_mail(info, booking_info)

        return SendEmail(ok=True)
