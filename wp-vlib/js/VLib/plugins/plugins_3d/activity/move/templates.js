<script type="text/html" class="pluginConfigForm" id="move">
    <ul class="list-group">
        <form class="form-horizontal" role="form">
            <form role="form">
                <li class="list-group-item">
                    <h3>Move</h3>
                </li>
                 <li class="list-group-item">
                    <div class="controls">
                        <input class="form-control" type="text" id="target" style="display:none;">
                        <label class="control-label" for="targetSelect">What?</label>
                        <select id="targetSelect"class="form-control">
                            <option value="group">Clicked group</option>
                            <option value="object">Clicked object</option>
                        </select>
                    </div>
                </li>
                <li class="list-group-item">
                    <div class="input-group">
                        <span class="input-group-addon"><input type="checkbox" id="yoyo"></span>
                        <span class="form-control" >Yoyo </span>
                    </div><br />
                    </li>
                    <li class="list-group-item">
                    <div class="controls">
                        <input class="form-control" type="text" id="easing" style="display:none;">
                        <label class="control-label" for="easingSelect">Easing</label>
                        <select id="easingSelect"class="form-control">
                            <option value="None">Linear</option>

                            <option value="QuadraticIn">Quadratic In</option>
                            <option value="QuadraticOut">Quadratic Out</option>
                            <option value="QuadraticInOut">Quadratic InOut</option>

                            <option value="ExponentialIn">Exponential In</option>
                            <option value="ExponentialOut">Exponential Out</option>option>
                            <option value="ExponentialInOut">Exponential InOut</option>

                            <option value="SinusoidalIn">Sinusoidal In</option>
                            <option value="SinusoidalOut">Sinusoidal Out</option>option>
                            <option value="SinusoidalInOut">Sinusoidal InOut</option>

                            <option value="BackIn">Back In</option>
                            <option value="BackOut">Back Out</option>option>
                            <option value="BackInOut">Back InOut</option>

                            <option value="ElasticIn">Elastic In</option>
                            <option value="ElasticOut">Elastic Out</option>option>
                            <option value="ElasticInOut">Elastic InOut</option>

                            <option value="BounceIn">Bounce In</option>
                            <option value="BounceOut">Bounce Out</option>option>
                            <option value="BounceInOut">Bounce InOut</option>
                        </select>
                    </div>
                </li>

                <li class="list-group-item">
                    <label class="control-label" for="fadeTo">To </label>

                    <div class="controls" id="to-container">
                        <div class="input-group">
                            <span class="input-group-addon">x</span>
                            <input class="form-control" type="text" id="toX">
                            <span class="input-group-addon">y</span>
                            <input class="form-control" type="text" id="toY">
                            <span class="input-group-addon">z</span>
                            <input class="form-control" type="text" id="toZ">
                        </div>
                    </div>
                    <br />
                    <div class="input-group">
                        <span class="input-group-addon"><input type="checkbox" id="origin"></span>
                        <span class="form-control" >origin </span>
                    </div>
                </li>
                <li class="list-group-item">
                    <label class="control-label" for="duration">Duration </label>
                    <div class="controls">
                        <div class="input-group">
                            <input class="form-control" type="text" id="duration">
                            <span class="input-group-addon">Seconds</span>
                        </div>
                        <div id="durationSlider"></div>
                    </div>
                </li>
            </li>
        </form>
    </ul>
</script>
