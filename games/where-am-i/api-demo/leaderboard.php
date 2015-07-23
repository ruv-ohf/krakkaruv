<?php

// Settings
$dataFile = dirname(__FILE__) . '/leaderboard.data';
$dateFormat = 'd/m/Y H:i:s';


// Load leaderboard data
if (file_exists($dataFile)) {
    $data = unserialize(file_get_contents($dataFile));
} else {
    $data = array();
}


// Save new entry
$key = null;
if (isset($_POST['data'])) {
    $score = (int)$_POST['data']['score'];
    $profileUrl = (string)(isset($_POST['data']['url']) ? $_POST['data']['url'] : '');
    if (!preg_match('#^https?://[^<>"\']+$#', $profileUrl)) {
        $profileUrl = '';
    }
    $username = (string)$_POST['data']['username'];
    if ($username) {
        $time = time();
        $key = str_pad((string)$score, 20, '0', STR_PAD_LEFT).'-'.$time;
        $data[$key] = array(
            'score' => $score, 
            'profileUrl' => $profileUrl, 
            'username' => $username, 
            'date' => $time
        );
        krsort($data);
        file_put_contents($dataFile, serialize($data));
    }
}


// Display leaderboard
header('Content-type: text/html;charset=utf-8');
?>
<table cellpadding="0" cellspacing="0" class="table leaderboard">
    <thead>
        <tr>
            <th class="score">
                <i class="fa fa-fw fa-trophy"></i>
            </th>
            <th class="username">
                <i class="fa fa-fw fa-user"></i>
            </th>
            <th class="date">
                <i class="fa fa-fw fa-calendar"></i>
            </th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($data as $itemKey => $item) : ?> 
            <tr <?php if ($itemKey === $key) { echo 'class="current"'; } ?>>
                <td class="score">
                    <?php echo $item['score'] ?>
                </td>
                <td class="username">
                    <?php if ($item['profileUrl']) : ?>
                        <a href="<?php echo $item['profileUrl'] ?>">
                            <?php echo htmlspecialchars($item['username'], ENT_COMPAT, 'UTF-8'); ?>
                        </a>
                    <?php else:
                        echo htmlspecialchars($item['username'], ENT_COMPAT, 'UTF-8');
                    endif ?>
                </td>
                <td class="date">
                    <?php echo date($dateFormat, $item['date']); ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
