import datetime
import platform
import time

from django.http import JsonResponse


def current_time(request):
    now = datetime.datetime.now(tz=datetime.timezone.utc)

    data = {
        "datetime": now.isoformat(),
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M:%S"),
        "timezone": "UTC",
        "unix_timestamp": int(time.time()),
        "day_of_week": now.strftime("%A"),
        "week_number": now.isocalendar().week,
        "server": {
            "python_version": platform.python_version(),
            "platform": platform.system(),
        },
    }

    return JsonResponse(data)
